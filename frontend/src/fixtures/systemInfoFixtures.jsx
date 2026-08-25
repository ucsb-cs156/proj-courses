const systemInfoFixtures = {
  showingBoth: {
    springH2ConsoleEnabled: true,
    showSwaggerUILink: true,
    startQtrYYYYQ: "20084",
    endQtrYYYYQ: "20222",
    sourceRepo: "mocklink",
    commitId: "abc123",
    commitMessage: "This is a mock commit message",
    githubUrl: "https://github.com/ucsb-cs156/proj-courses/commit/abc123",
  },
  showingNeither: {
    springH2ConsoleEnabled: false,
    showSwaggerUILink: false,
    startQtrYYYYQ: "20084",
    endQtrYYYYQ: "20222",
    sourceRepo: "mocklink",
    commitId: "abc123",
    commitMessage: "This is a mock commit message",
    githubUrl: "https://github.com/ucsb-cs156/proj-courses/commit/abc123",
  },
  withSystemMessages: {
    springH2ConsoleEnabled: true,
    showSwaggerUILink: true,
    startQtrYYYYQ: "20084",
    endQtrYYYYQ: "20222",
    sourceRepo: "mocklink",
    commitId: "abc123",
    commitMessage: "This is a mock commit message",
    githubUrl: "https://github.com/ucsb-cs156/proj-courses/commit/abc123",
    systemMessages: [
      {
        variant: "danger",
        message: "This is a danger message",
      },
      {
        variant: "warning",
        message: "This is a warning message",
      },
      {
        variant: "success",
        message: "This is a success message",
      },
      {
        variant: "info",
        message: "This is an info message",
      },
    ],
  },
  withFeedbackUrl: {
    springH2ConsoleEnabled: true,
    showSwaggerUILink: true,
    startQtrYYYYQ: "20084",
    endQtrYYYYQ: "20222",
    sourceRepo: "mocklink",
    commitId: "abc123",
    commitMessage: "This is a mock commit message",
    githubUrl: "https://github.com/ucsb-cs156/proj-courses/commit/abc123",
    appFeedbackUrl: "https://example.com/feedback",
  },
};

export { systemInfoFixtures };
