import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { IMAGE_SUCCESS } from '@lemon-peel/test-utils/mock';
import ImageViewer from '../src/ImageViewer.vue';

import type { ImageViewerProps } from '../src/imageViewer';

async function doubleWait() {
  await nextTick();
  await nextTick();
}

const doMount = (props: Partial<ImageViewerProps>) => mount(
  () => <ImageViewer {...props} />,
  { attachTo: document.body },
);

describe('<image-viewer />', () => {
  test('big image preview', async () => {
    const wrapper = doMount({
      urlList: [IMAGE_SUCCESS],
    });

    await doubleWait();
    const viewer = wrapper.find('.lp-image-viewer__wrapper');
    expect(viewer.exists()).toBe(true);
    await wrapper.find('.lp-image-viewer__close').trigger('click');
    const ins = wrapper.findComponent(ImageViewer);
    expect(ins.emitted('close')).toEqual([[]]);
    wrapper.unmount();
  });

  test('image preview hide-click-on-modal', async () => {
    const hideOnClickModal = ref(false);
    const wrapper = mount(
      () => <ImageViewer urlList={[IMAGE_SUCCESS]} hideOnClickModal={hideOnClickModal.value} />,
      { attachTo: document.body },
    );

    await doubleWait();
    const ins = wrapper.findComponent(ImageViewer);
    const viewer = wrapper.find('.lp-image-viewer__wrapper');
    expect(viewer.exists()).toBe(true);
    await wrapper.find('.lp-image-viewer__mask').trigger('click');
    expect(ins.emitted('close')).toBeUndefined();

    hideOnClickModal.value = true;
    await doubleWait();
    await wrapper.find('.lp-image-viewer__mask').trigger('click');
    expect(ins.emitted('close')).toBeDefined();
    wrapper.unmount();
  });

  test('manually switch image', async () => {
    const wrapper = mount(
      () => <ImageViewer urlList={[IMAGE_SUCCESS, IMAGE_SUCCESS]} />,
      { attachTo: document.body },
    );

    await doubleWait();
    const viewer = wrapper.find('.lp-image-viewer__wrapper');
    expect(viewer.exists()).toBe(true);

    const imgList = wrapper.findAll('.lp-image-viewer__img');
    expect(imgList[0].attributes('style')).not.contains('display: none;');
    expect(imgList[1].attributes('style')).contains('display: none;');

    const ins = wrapper.findComponent(ImageViewer);
    ins.vm.setActiveItem(1);
    await doubleWait();
    expect(imgList[0].attributes('style')).contains('display: none;');
    expect(imgList[1].attributes('style')).not.contains('display: none;');
    wrapper.unmount();
  });
});
