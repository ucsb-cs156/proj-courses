// vitest.setup.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock jest global for compatibility
global.jest = {
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  restoreAllMocks: vi.restoreAllMocks,
  spyOn: vi.spyOn,
  fn: vi.fn,
  mock: vi.mock,
};