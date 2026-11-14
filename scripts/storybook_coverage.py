#!/usr/bin/env python3
"""
Report which React components/pages do not have a matching Storybook story.

The frontend follows a one-to-one directory mirroring convention:

    frontend/src/main/components/Foo/Bar.jsx
      -> frontend/src/stories/components/Foo/Bar.stories.jsx

    frontend/src/main/pages/Foo/BarPage.jsx
      -> frontend/src/stories/pages/Foo/BarPage.stories.jsx

This script walks each (main, stories) directory pair, and for every component
file in the main tree checks whether a story file with the same relative path
(and a ``.stories.*`` extension) exists in the stories tree.

It prints a Markdown report to stdout.  When run inside GitHub Actions
(i.e. when ``GITHUB_STEP_SUMMARY`` is set) the same report is also appended to
the job summary so that it shows up on the workflow run page.

Exit status is 0 unless ``--fail-on-missing`` is given (or the environment
variable ``FAIL_ON_MISSING_STORIES`` is ``true``), in which case the exit
status is 1 whenever at least one component is missing a story.

Usage (from the repo root):

    python3 scripts/storybook_coverage.py
    python3 scripts/storybook_coverage.py --fail-on-missing
    python3 scripts/storybook_coverage.py --dir main/layouts:stories/layouts
"""

from __future__ import annotations

import argparse
import os
import sys
from dataclasses import dataclass, field
from pathlib import Path

FRONTEND_SRC = Path("frontend") / "src"

# (main subtree, stories subtree) pairs, relative to frontend/src.
DEFAULT_DIR_PAIRS = [
    ("main/components", "stories/components"),
    ("main/pages", "stories/pages"),
]

# File extensions that count as a React component / page.
COMPONENT_EXTENSIONS = (".jsx", ".tsx")

# Plain .js/.ts files in the main tree are normally helpers/utilities
# (e.g. OurTableUtils.js) rather than React components, so they are not
# expected to have stories unless --include-js is given.
JS_EXTENSIONS = (".js", ".ts")

# Any of these counts as "a story exists" for a given component.
STORY_EXTENSIONS = (
    ".stories.jsx",
    ".stories.js",
    ".stories.tsx",
    ".stories.ts",
    ".stories.mjs",
    ".mdx",
)


@dataclass
class PairResult:
    """Coverage results for one (main dir, stories dir) pair."""

    main_dir: str
    stories_dir: str
    covered: list[str] = field(default_factory=list)
    missing: list[str] = field(default_factory=list)
    orphan_stories: list[str] = field(default_factory=list)

    @property
    def total(self) -> int:
        return len(self.covered) + len(self.missing)

    @property
    def percent(self) -> float:
        return 100.0 if self.total == 0 else 100.0 * len(self.covered) / self.total


def _strip_story_suffix(rel_path: str) -> str | None:
    """Return the component stem for a story path, or None if not a story."""
    for ext in STORY_EXTENSIONS:
        if rel_path.endswith(ext):
            return rel_path[: -len(ext)]
    return None


def _strip_component_suffix(rel_path: str, extensions: tuple[str, ...]) -> str | None:
    for ext in extensions:
        if rel_path.endswith(ext):
            return rel_path[: -len(ext)]
    return None


def _relative_files(root: Path) -> list[str]:
    if not root.is_dir():
        return []
    return sorted(
        p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file()
    )


def analyze_pair(
    src_root: Path,
    main_dir: str,
    stories_dir: str,
    include_js: bool = False,
) -> PairResult:
    """Compare one main subtree against its stories subtree."""
    extensions = COMPONENT_EXTENSIONS + (JS_EXTENSIONS if include_js else ())

    result = PairResult(main_dir=main_dir, stories_dir=stories_dir)

    story_stems: set[str] = set()
    for rel in _relative_files(src_root / stories_dir):
        stem = _strip_story_suffix(rel)
        if stem is not None:
            story_stems.add(stem)

    component_stems: set[str] = set()
    for rel in _relative_files(src_root / main_dir):
        stem = _strip_component_suffix(rel, extensions)
        if stem is None:
            continue
        component_stems.add(stem)
        if stem in story_stems:
            result.covered.append(rel)
        else:
            result.missing.append(rel)

    result.orphan_stories = sorted(
        stem for stem in story_stems if stem not in component_stems
    )
    return result


def analyze(
    src_root: Path,
    dir_pairs: list[tuple[str, str]],
    include_js: bool = False,
) -> list[PairResult]:
    return [analyze_pair(src_root, m, s, include_js) for m, s in dir_pairs]


def render_markdown(results: list[PairResult], src_root: Path) -> str:
    """Render the coverage report as GitHub-flavoured Markdown."""
    total = sum(r.total for r in results)
    covered = sum(len(r.covered) for r in results)
    missing = sum(len(r.missing) for r in results)
    percent = 100.0 if total == 0 else 100.0 * covered / total

    lines: list[str] = []
    lines.append("# Storybook coverage report")
    lines.append("")
    lines.append(
        f"**Overall: {covered} of {total} components have a story "
        f"({percent:.1f}%). Missing: {missing}.**"
    )
    lines.append("")
    lines.append("| Directory | Covered | Missing | Coverage |")
    lines.append("|-----------|--------:|--------:|---------:|")
    for r in results:
        lines.append(
            f"| `{(src_root / r.main_dir).as_posix()}` "
            f"| {len(r.covered)} | {len(r.missing)} | {r.percent:.1f}% |"
        )
    lines.append("")

    for r in results:
        lines.append(f"## {r.main_dir}")
        lines.append("")
        if r.missing:
            lines.append(
                f"### Missing stories ({len(r.missing)})"
            )
            lines.append("")
            lines.append("| Component | Expected story |")
            lines.append("|-----------|----------------|")
            for rel in r.missing:
                stem = _strip_component_suffix(
                    rel, COMPONENT_EXTENSIONS + JS_EXTENSIONS
                )
                comp_path = (src_root / r.main_dir / rel).as_posix()
                story_path = (
                    src_root / r.stories_dir / f"{stem}.stories.jsx"
                ).as_posix()
                lines.append(f"| `{comp_path}` | `{story_path}` |")
            lines.append("")
        else:
            lines.append(":white_check_mark: Every component has a story.")
            lines.append("")

        if r.orphan_stories:
            lines.append(
                f"### Stories with no matching component ({len(r.orphan_stories)})"
            )
            lines.append("")
            lines.append(
                "These story files do not line up with a component file of the "
                "same name. This usually means a naming mismatch (e.g. the story "
                "is named `FooTable` but the component is `FoosTable`), or a "
                "component that was renamed or deleted."
            )
            lines.append("")
            for stem in r.orphan_stories:
                lines.append(f"- `{(src_root / r.stories_dir / stem).as_posix()}.stories.*`")
            lines.append("")

    return "\n".join(lines)


def _parse_dir_pair(value: str) -> tuple[str, str]:
    if ":" not in value:
        raise argparse.ArgumentTypeError(
            f"expected MAIN_DIR:STORIES_DIR, got {value!r}"
        )
    main_dir, stories_dir = value.split(":", 1)
    return main_dir.strip("/"), stories_dir.strip("/")


def _env_flag(name: str) -> bool:
    return os.environ.get(name, "").strip().lower() in ("1", "true", "yes", "on")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--src-root",
        type=Path,
        default=FRONTEND_SRC,
        help=f"Path to the frontend src directory (default: {FRONTEND_SRC})",
    )
    parser.add_argument(
        "--dir",
        dest="dir_pairs",
        action="append",
        type=_parse_dir_pair,
        metavar="MAIN_DIR:STORIES_DIR",
        help=(
            "A main:stories directory pair relative to --src-root. May be "
            "repeated. Defaults to "
            + " and ".join(f"{m}:{s}" for m, s in DEFAULT_DIR_PAIRS)
        ),
    )
    parser.add_argument(
        "--include-js",
        action="store_true",
        help="Also treat plain .js/.ts files as components that need stories",
    )
    parser.add_argument(
        "--fail-on-missing",
        action="store_true",
        default=_env_flag("FAIL_ON_MISSING_STORIES"),
        help=(
            "Exit with status 1 if any component is missing a story. "
            "Also enabled when env var FAIL_ON_MISSING_STORIES=true."
        ),
    )
    parser.add_argument(
        "--no-summary",
        action="store_true",
        help="Do not append the report to $GITHUB_STEP_SUMMARY even if set",
    )
    args = parser.parse_args(argv)

    dir_pairs = args.dir_pairs or DEFAULT_DIR_PAIRS
    results = analyze(args.src_root, dir_pairs, include_js=args.include_js)
    report = render_markdown(results, args.src_root)

    print(report)

    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path and not args.no_summary:
        with open(summary_path, "a", encoding="utf-8") as f:
            f.write(report)
            f.write("\n")

    missing = sum(len(r.missing) for r in results)
    if args.fail_on_missing and missing > 0:
        print(
            f"\nFAIL: {missing} component(s) are missing stories "
            "(fail-on-missing is enabled).",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
