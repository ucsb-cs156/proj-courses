const systemInfoFixtures = {
  showingBoth: {
    springH2ConsoleEnabled: true,
    showSwaggerUILink: true,
    startQtrYYYYQ: "20084",
    endQtrYYYYQ: "20222",
    sourceRepo: "mocklink",
  },
  showingNeither: {
    springH2ConsoleEnabled: false,
    showSwaggerUILink: false,
    startQtrYYYYQ: "20084",
    endQtrYYYYQ: "20222",
    sourceRepo: "mocklink",
  },
  withSystemMessages: {
    springH2ConsoleEnabled: true,
    showSwaggerUILink: true,
    startQtrYYYYQ: "20084",
    endQtrYYYYQ: "20222",
    sourceRepo: "mocklink",
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
};

export { systemInfoFixtures };
