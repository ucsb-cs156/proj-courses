// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
    _comment:
        "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
    packageManager: "npm",
    reporters: ["html", "clear-text", "progress"],
    testRunner: "vitest",
    mutate: ["src/main/**/*.js", "src/main/**/*.jsx"],
    testRunner_comment:
        "Take a look at https://stryker-mutator.io/docs/stryker-js/vitest-runner for information about the vitest plugin.",
    coverageAnalysis: "perTest",
    thresholds: {
        high: 100,
        low: 100,
        break: 100,
    },
};
export default config;