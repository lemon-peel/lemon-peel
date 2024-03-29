import { nextTick, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { useRestoreActive } from '../src/useRestoreActive';

describe('useRestoreActive', () => {
  it('should restore active element', async () => {
    const visible = ref(false);
    useRestoreActive(visible);

    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    document.body.append(btn1);
    document.body.append(btn2);
    btn1.focus();
    expect(document.activeElement).toBe(btn1);
    visible.value = true;
    await nextTick();
    btn2.focus();
    expect(document.activeElement).toBe(btn2);
    visible.value = false;
    await nextTick();
    expect(document.activeElement).toBe(btn1);
  });
});
