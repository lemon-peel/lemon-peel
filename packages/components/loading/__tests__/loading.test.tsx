// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Loading } from '../src/service';
import { vLoading } from '../src/directive';
import LpInput from '../../input';

import type { VNode } from 'vue';
import type { LoadingInstance } from '../src/loading';

function destroyLoadingInstance(loadingInstance: LoadingInstance) {
  if (!loadingInstance) return;
  loadingInstance.close();
  loadingInstance.$el?.remove();
}

const doMount = (render: () => VNode | null) => {
  return mount(render, { global: { directives: { loading: vLoading } }, attachTo: 'body' });
};

describe('Loading', () => {
  let loadingInstance: LoadingInstance; let loadingInstance2: LoadingInstance;

  afterEach(() => {
    document.body.innerHTML = '';
    destroyLoadingInstance(loadingInstance);
    destroyLoadingInstance(loadingInstance2);
  });

  test('create directive', async () => {
    const loading = ref(true);
    const wrapper = doMount(() => <div v-loading={loading.value} />);

    await nextTick();

    const maskWrapper = wrapper.find('.lp-loading-mask');
    expect(maskWrapper.exists()).toBeTruthy();

    vi.useFakeTimers();
    loading.value = false;
    // Trigger update event for dispatching close event.
    await nextTick();

    vi.runAllTimers();
    vi.useRealTimers();
    await nextTick();
    expect(wrapper.find('.lp-loading-mask').exists()).toBeFalsy();
  });

  test('unmounted directive', async () => {
    const loading1 = ref(true);
    const show1 = ref(true);
    const loading2 = ref(true);
    const show2 = ref(true);
    doMount(() => (show1.value ? <div v-loading={loading1.value} /> : null));
    doMount(() => (show2.value ? <div v-loading={loading2.value} /> : null));

    await nextTick();
    loading1.value = false;
    loading2.value = false;

    await nextTick();
    show1.value = false;
    show2.value = false;

    await nextTick();
    expect(document.querySelector('.lp-loading-mask')).toBeFalsy();
  });

  test('body directive', async () => {
    const loading = ref(true);
    const wrapper = doMount(() => <div v-loading_body={loading.value} />);

    await nextTick();
    const mask = document.querySelector('.lp-loading-mask')!;
    expect(mask.parentNode === document.body).toBeTruthy();
    wrapper.vm.loading = false;
    mask.remove();
  });

  test('fullscreen directive', async () => {
    const loading = ref(true);
    doMount(() => <div v-loading_fullscreen={loading.value} />);

    await nextTick();
    const mask = document.querySelector('.lp-loading-mask')!;
    expect(mask.parentNode === document.body).toBeTruthy();
    expect(mask.classList.contains('is-fullscreen')).toBeTruthy();
    loading.value = false;
    mask.remove();
  });

  test('lock directive', async () => {
    const loading = ref(true);
    doMount(() => <div v-loading_fullscreen_lock={loading.value} />);

    await nextTick();
    expect(
      document.body.classList.contains('lp-loading-parent--hidden'),
    ).toBeTruthy();
    loading.value = false;
    (document.querySelector('.lp-loading-mask')!).remove();
  });

  test('text directive', async () => {
    const loading = ref(true);
    const wrapper = doMount(() => (
      <div v-loading={loading.value} lp-loading-text="loading..." />
    ));

    await nextTick();
    expect(wrapper.find('.lp-loading-text').text()).toEqual('loading...');
  });

  test('customClass directive', async () => {
    const loading = ref(true);
    const wrapper = doMount(() => (
      <div
        v-loading={loading.value}
        lp-loading-custom-class="loading-custom-class"
      />
    ));

    await nextTick();
    expect(wrapper.find('.loading-custom-class').exists()).toBeTruthy();
  });

  test('customSvg directive', async () => {
    const loading = ref(true);
    const svg = '<path class="custom-path" d="M 30 15"/>';
    const wrapper = doMount(() => (
      <div v-loading={loading.value} lp-loading-svg={svg} />
    ));

    await nextTick();
    expect(wrapper.find('.custom-path').attributes().d).toEqual('M 30 15');
  });

  test('create service', async () => {
    loadingInstance = Loading();
    expect(document.querySelector('.lp-loading-mask')).toBeTruthy();
  });

  test('close service', async () => {
    loadingInstance = Loading();
    loadingInstance.close();
    expect(loadingInstance.visible.value).toBeFalsy();
  });

  test('target service', async () => {
    const container = document.createElement('div');
    container.className = 'loading-container';
    document.body.append(container);

    loadingInstance = Loading({ target: '.loading-container' });
    const mask = container.querySelector('.lp-loading-mask')!;
    expect(mask).toBeTruthy();
    expect(mask.parentNode).toEqual(container);

    expect(
      container.classList.contains('lp-loading-parent--relative'),
    ).toBeTruthy();

    vi.useFakeTimers();
    loadingInstance.close();
    vi.runAllTimers();
    vi.useRealTimers();
    await nextTick();

    expect(
      container.classList.contains('lp-loading-parent--relative'),
    ).toBeFalsy();
  });

  test('body service', async () => {
    const container = document.createElement('div');
    container.className = 'loading-container';
    document.body.append(container);

    loadingInstance = Loading({ target: '.loading-container', body: true });
    const mask = document.querySelector('.lp-loading-mask')!;
    expect(mask).toBeTruthy();
    expect(mask.parentNode).toEqual(document.body);
  });

  test('fullscreen service', async () => {
    loadingInstance = Loading({ fullscreen: true });
    const mask = document.querySelector('.lp-loading-mask')!;
    expect(mask.parentNode).toEqual(document.body);
    expect(mask.classList.contains('is-fullscreen')).toBeTruthy();
  });

  test('fullscreen singleton service', async () => {
    vi.useFakeTimers();
    loadingInstance = Loading({ fullscreen: true });
    vi.runAllTimers();
    await nextTick();

    loadingInstance2 = Loading({ fullscreen: true });
    vi.runAllTimers();
    await nextTick();

    let masks = document.querySelectorAll('.lp-loading-mask');
    expect(loadingInstance).toEqual(loadingInstance2);
    expect(masks.length).toEqual(1);
    loadingInstance2.close();
    vi.runAllTimers();
    vi.useRealTimers();
    await nextTick();

    masks = document.querySelectorAll('.lp-loading-mask');
    expect(masks.length).toEqual(0);
  });

  test('lock service', async () => {
    loadingInstance = Loading({ lock: true });
    expect(
      document.body.classList.contains('lp-loading-parent--hidden'),
    ).toBeTruthy();
  });

  test('text service', async () => {
    loadingInstance = Loading({ text: 'Loading...' });
    const text = document.querySelector('.lp-loading-text')!;
    expect(text).toBeTruthy();
    expect(text.textContent).toEqual('Loading...');
  });

  test('customClass service', async () => {
    loadingInstance = Loading({ customClass: 'lp-loading-custom-class' });
    const customClass = document.querySelector('.lp-loading-custom-class');
    expect(customClass).toBeTruthy();
  });

  test("parent's display is not block", async () => {
    const loading = ref(true);
    const wrapper = doMount(() => (
      <LpInput
        v-loading={loading.value}
        v-slots={{
          append: () => 'Loading Text',
        }}
      />
    ));

    await nextTick();
    await nextTick();
    const maskDisplay = getComputedStyle(
      wrapper.find('.lp-loading-mask').element,
    ).display;
    expect(maskDisplay).toBe('block');
  });
});
