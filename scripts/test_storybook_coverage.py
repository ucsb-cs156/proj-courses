"""
Unit tests for storybook_coverage.py.

Run from the repo root with:

    python3 -m unittest scripts/test_storybook_coverage.py
"""

import contextlib
import io
import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import storybook_coverage as sc  # noqa: E402


def touch(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("")


class AnalyzePairTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.src = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def test_covered_and_missing_are_detected(self):
        touch(self.src / "main/components/Foo/Covered.jsx")
        touch(self.src / "stories/components/Foo/Covered.stories.jsx")
        touch(self.src / "main/components/Foo/Missing.jsx")
        touch(self.src / "main/components/TopLevel.jsx")
        touch(self.src / "stories/components/TopLevel.stories.jsx")

        r = sc.analyze_pair(self.src, "main/components", "stories/components")

        self.assertEqual(r.covered, ["Foo/Covered.jsx", "TopLevel.jsx"])
        self.assertEqual(r.missing, ["Foo/Missing.jsx"])
        self.assertEqual(r.total, 3)
        self.assertAlmostEqual(r.percent, 200 / 3)

    def test_js_helpers_are_ignored_unless_include_js(self):
        touch(self.src / "main/components/OurTableUtils.js")
        touch(self.src / "main/components/OurTable.jsx")
        touch(self.src / "stories/components/OurTable.stories.jsx")

        r = sc.analyze_pair(self.src, "main/components", "stories/components")
        self.assertEqual(r.missing, [])
        self.assertEqual(r.total, 1)

        r = sc.analyze_pair(
            self.src, "main/components", "stories/components", include_js=True
        )
        self.assertEqual(r.missing, ["OurTableUtils.js"])
        self.assertEqual(r.total, 2)

    def test_alternate_story_extensions_count(self):
        touch(self.src / "main/pages/A.jsx")
        touch(self.src / "stories/pages/A.stories.js")
        touch(self.src / "main/pages/B.tsx")
        touch(self.src / "stories/pages/B.stories.tsx")
        touch(self.src / "main/pages/C.jsx")
        touch(self.src / "stories/pages/C.mdx")

        r = sc.analyze_pair(self.src, "main/pages", "stories/pages")
        self.assertEqual(r.missing, [])
        self.assertEqual(r.covered, ["A.jsx", "B.tsx", "C.jsx"])

    def test_orphan_stories_are_reported(self):
        touch(self.src / "main/components/Sections/SectionsTable.jsx")
        touch(self.src / "stories/components/Sections/SectionTable.stories.jsx")

        r = sc.analyze_pair(self.src, "main/components", "stories/components")
        self.assertEqual(r.missing, ["Sections/SectionsTable.jsx"])
        self.assertEqual(r.orphan_stories, ["Sections/SectionTable"])

    def test_non_component_files_in_main_are_ignored(self):
        touch(self.src / "main/components/styles.css")
        touch(self.src / "main/components/README.md")

        r = sc.analyze_pair(self.src, "main/components", "stories/components")
        self.assertEqual(r.total, 0)
        self.assertEqual(r.percent, 100.0)

    def test_missing_directories_do_not_crash(self):
        r = sc.analyze_pair(self.src, "main/nonexistent", "stories/nonexistent")
        self.assertEqual(r.total, 0)
        self.assertEqual(r.missing, [])
        self.assertEqual(r.orphan_stories, [])


class RenderAndMainTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.src = Path(self.tmp.name)
        touch(self.src / "main/components/Foo/Covered.jsx")
        touch(self.src / "stories/components/Foo/Covered.stories.jsx")
        touch(self.src / "main/components/Foo/Missing.jsx")
        touch(self.src / "main/pages/HomePage.jsx")
        touch(self.src / "stories/pages/HomePage.stories.jsx")

    def tearDown(self):
        self.tmp.cleanup()

    def test_render_markdown_includes_summary_and_missing(self):
        results = sc.analyze(self.src, sc.DEFAULT_DIR_PAIRS)
        md = sc.render_markdown(results, Path("frontend/src"))
        self.assertIn("2 of 3 components have a story (66.7%)", md)
        self.assertIn("frontend/src/main/components/Foo/Missing.jsx", md)
        self.assertIn(
            "frontend/src/stories/components/Foo/Missing.stories.jsx", md
        )
        self.assertIn("Every component has a story", md)  # pages section

    def test_main_exit_code_default_is_zero_even_with_missing(self):
        env = dict(os.environ)
        os.environ.pop("FAIL_ON_MISSING_STORIES", None)
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                rc = sc.main(["--src-root", str(self.src), "--no-summary"])
        finally:
            os.environ.clear()
            os.environ.update(env)
        self.assertEqual(rc, 0)

    def test_main_fail_on_missing_flag(self):
        env = dict(os.environ)
        os.environ.pop("FAIL_ON_MISSING_STORIES", None)
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                rc = sc.main(
                ["--src-root", str(self.src), "--no-summary", "--fail-on-missing"]
            )
        finally:
            os.environ.clear()
            os.environ.update(env)
        self.assertEqual(rc, 1)

    def test_main_fail_on_missing_env_var(self):
        env = dict(os.environ)
        os.environ["FAIL_ON_MISSING_STORIES"] = "true"
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                rc = sc.main(["--src-root", str(self.src), "--no-summary"])
        finally:
            os.environ.clear()
            os.environ.update(env)
        self.assertEqual(rc, 1)

    def test_main_fail_on_missing_passes_with_full_coverage(self):
        touch(self.src / "stories/components/Foo/Missing.stories.jsx")
        with contextlib.redirect_stdout(io.StringIO()):
            rc = sc.main(
            ["--src-root", str(self.src), "--no-summary", "--fail-on-missing"]
        )
        self.assertEqual(rc, 0)

    def test_github_step_summary_is_written(self):
        summary = self.src / "summary.md"
        env = dict(os.environ)
        os.environ["GITHUB_STEP_SUMMARY"] = str(summary)
        os.environ.pop("FAIL_ON_MISSING_STORIES", None)
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                sc.main(["--src-root", str(self.src)])
        finally:
            os.environ.clear()
            os.environ.update(env)
        self.assertIn("# Storybook coverage report", summary.read_text())


if __name__ == "__main__":
    unittest.main()
