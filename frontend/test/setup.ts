import '@testing-library/jest-dom/vitest';
import {cleanup} from '@testing-library/react';
import {afterEach, beforeAll, vi} from 'vitest';
import './mocks/auth0';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function mock(
    this: HTMLDialogElement,
  ) {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = vi.fn(function mock(
    this: HTMLDialogElement,
  ) {
    this.open = false;
  });
});

// Automatically clean up the DOM after each test
afterEach(() => {
  cleanup();
});
