import { vi } from "vitest";

const mockConsole = () => {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});

  // Return a function to restore the original console behavior
  return () => {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  };
};

export default mockConsole;
