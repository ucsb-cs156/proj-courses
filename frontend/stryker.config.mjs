// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
    _comment:
        "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
    packageManager: "npm",
    reporters: ["html", "clear-text", "progress"],
    testRunner: "vitest",
    vitest:{
      configFile: "vite.config.mjs",
    },
    mutate: ["src/main/**/*.js", "src/main/**/*.jsx", "!src/main/**/*_NoStryker.{js,jsx,ts,tsx}"],
    testRunner_comment:
        "Take a look at https://stryker-mutator.io/docs/stryker-js/vitest-runner for information about the vitest plugin.",
    coverageAnalysis: "perTest",
    mutator: {
        // Stryker 10 added the "CallExpression" mutator (deletes bare call statements such as
        // localStorage.setItem(...)). It is excluded to keep the same mutation strictness as Stryker 9;
        // enabling it requires new tests across many components (see docs/versions.md).
        excludedMutations: ["CallExpression"],
    },
    thresholds: {
        high: 100,
        low: 100,
        break: 100,
    },
};
export default config;