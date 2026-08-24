import { describe, it, expect } from 'vitest';
import { VERSION } from './index';

describe('SDK Basic', () => {
  it('should export VERSION', () => {
    expect(VERSION).toBe('1.0.0');
  });
});