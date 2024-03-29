import { nextTick } from 'vue';
import { vi } from 'vitest';

vi.mock('lodash', async load => {
  const mod: any = await load();
  return {
    ...mod.default,
    debounce: vi.fn(fn => {
      fn.cancel = vi.fn();
      fn.flush = vi.fn();
      return fn;
    }),
  };
});

export async function doubleWait() {
  await nextTick();
  await nextTick();
}

export function getTestData() {
  return [
    {
      id: 1,
      name: 'Toy Story',
      release: '1995-11-22',
      director: 'John Lasseter',
      runtime: 80,
    },
    {
      id: 2,
      name: "A Bug's Life",
      release: '1998-11-25',
      director: 'John Lasseter',
      runtime: 95,
    },
    {
      id: 3,
      name: 'Toy Story 2',
      release: '1999-11-24',
      director: 'John Lasseter',
      runtime: 92,
    },
    {
      id: 4,
      name: 'Monsters, Inc.',
      release: '2001-11-2',
      director: 'Peter Docter',
      runtime: 92,
    },
    {
      id: 5,
      name: 'Finding Nemo',
      release: '2003-5-30',
      director: 'Andrew Stanton',
      runtime: 100,
    },
  ];
}
