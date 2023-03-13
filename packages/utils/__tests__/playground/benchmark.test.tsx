import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Benchemark from './Benchmark.vue';

describe('Benchmark', () => {
  test('first', () => {
    const wp = mount(() => <Benchemark></Benchemark>);
    expect(wp).toBeDefined();
  });
});