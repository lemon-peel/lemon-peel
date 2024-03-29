import { describe, expect, it } from 'vitest';
import { castArray as lodashCastArray } from 'lodash';
import { castArray, ensureArray, unique } from '../index';

describe('arrays', () => {
  it('unique should work', () => {
    expect(unique([1, 2, 3, 1])).toEqual([1, 2, 3]);
    expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('castArray should work', () => {
    expect(castArray([1, 2, 3])).toEqual([1, 2, 3]);
    expect(castArray(0)).toEqual([0]);
    expect(castArray()).toEqual([]);
  });

  it('re-export ensureArray', () => {
    expect(ensureArray).toBe(lodashCastArray);
  });
});
