// vitest.setup.js
import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

// Mock jest global for compatibility
Object.defineProperty(globalThis, 'jest', {
  value: {
    clearAllMocks: vi.clearAllMocks,
    resetAllMocks: vi.resetAllMocks,
    restoreAllMocks: vi.restoreAllMocks,
    spyOn: vi.spyOn,
    fn: vi.fn,
    mock: vi.mock,
    doMock: vi.doMock,
    unmock: vi.unmock,
    mocked: vi.mocked,
  },
  writable: true,
  configurable: true,
});

// Also make it available globally for test files
globalThis.jest = globalThis.jest;