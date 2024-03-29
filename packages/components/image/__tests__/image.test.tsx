import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import { IMAGE_FAIL, IMAGE_SUCCESS, mockImageEvent } from '@lemon-peel/test-utils/mock';
import LpImage from '../src/Image.vue';
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'vue';
import type { ImageProps } from '../src/image';

type LpImageProps = ImgHTMLAttributes &
AnchorHTMLAttributes &
Partial<ImageProps>;

// firstly wait for image event
// secondly wait for vue render
async function doubleWait() {
  await nextTick();
  await nextTick();
}

describe('Image.vue', () => {
  mockImageEvent();

  test('render test', () => {
    const wrapper = mount(() => <LpImage src={IMAGE_SUCCESS} />);
    expect(wrapper.find('.lp-image').exists()).toBe(true);
  });

  test('image load success test', async () => {
    const alt = 'this ia alt';
    const wrapper = mount({
      setup() {
        const props: LpImageProps = {
          alt,
          src: IMAGE_SUCCESS,
        };
        return () => <LpImage {...props} />;
      },
    });
    expect(wrapper.find('.lp-image__placeholder').exists()).toBe(true);
    await doubleWait();
    expect(wrapper.find('.lp-image__inner').exists()).toBe(true);
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('.lp-image__placeholder').exists()).toBe(false);
    expect(wrapper.find('.lp-image__error').exists()).toBe(false);
  });

  test('image load error test', async () => {
    const wrapper = mount(() => <LpImage src={IMAGE_FAIL} />);
    await doubleWait();
    const img = wrapper.findComponent(LpImage);
    expect(img.emitted('error')).toBeDefined();
    expect(wrapper.find('.lp-image__inner').exists()).toBe(false);
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.find('.lp-image__error').exists()).toBe(true);
  });

  test('image load sequence success test', async () => {
    const src = ref(IMAGE_FAIL);
    const wrapper = mount(() => <LpImage src={src.value} />);
    src.value = IMAGE_SUCCESS;
    expect(wrapper.find('.lp-image__placeholder').exists()).toBe(true);
    await doubleWait();
    expect(wrapper.emitted('error')).toBeUndefined();
    expect(wrapper.find('.lp-image__inner').exists()).toBe(true);
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('.lp-image__placeholder').exists()).toBe(false);
    expect(wrapper.find('.lp-image__error').exists()).toBe(false);
  });

  test('imageStyle fit test', async () => {
    const fits = ['fill', 'contain', 'cover', 'none', 'scale-down'] as const;
    for (const fit of fits) {
      const wrapper = mount(() => <LpImage src={IMAGE_SUCCESS} fit={fit} />);
      await doubleWait();
      expect(wrapper.find('img').attributes('style')).toContain(
        `object-fit: ${fit};`,
      );
    }
  });

  test('preview classname test', async () => {
    const props: LpImageProps = {
      fit: 'cover',
      src: IMAGE_SUCCESS,
      previewSrcList: Array.from<string>({ length: 3 }).fill(IMAGE_SUCCESS),
    };
    const wrapper = mount(() => <LpImage {...props} />);
    await doubleWait();
    expect(wrapper.find('img').classes()).toContain('lp-image__preview');
  });

  test('preview initial index test', async () => {
    const props: LpImageProps = {
      src: IMAGE_SUCCESS,
      previewSrcList: Array.from<string>({ length: 3 }).fill(IMAGE_FAIL),
      initialIndex: 1,
    };
    const wrapper = mount(() => <LpImage {...props} />);
    await doubleWait();
    await wrapper.find('.lp-image__inner').trigger('click');
    expect(
      wrapper.findAll('.lp-image-viewer__img')[1].attributes('style'),
    ).not.toContain('display: none');
  });

  test('native loading attributes', async () => {
    const wrapper = mount(LpImage as any, {
      props: {
        src: IMAGE_SUCCESS,
        loading: 'eager',
      } as LpImageProps,
    });

    await doubleWait();
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('img').attributes('loading')).toBe('eager');

    await wrapper.setProps({ loading: undefined });
    expect(wrapper.find('img').attributes('loading')).toBe(undefined);
  });

  test('$attrs', async () => {
    const alt = 'this ia alt';
    const props: LpImageProps = {
      alt,
      src: IMAGE_SUCCESS,
      referrerpolicy: 'origin',
    };
    const wrapper = mount(() => <LpImage {...props} />);
    await doubleWait();
    expect(wrapper.find('img').attributes('alt')).toBe(alt);
    expect(wrapper.find('img').attributes('referrerpolicy')).toBe('origin');
  });

  test('pass event listeners', async () => {
    let result = false;
    const props: LpImageProps = {
      src: IMAGE_SUCCESS,
      onClick: () => (result = true),
    };
    const wrapper = mount(() => <LpImage {...props} />);
    await doubleWait();
    await wrapper.find('.lp-image__inner').trigger('click');
    expect(result).toBeTruthy();
  });

  test('emit load event', async () => {
    const handleLoad = vi.fn();
    const props: LpImageProps = {
      src: IMAGE_SUCCESS,
      onLoad: handleLoad,
    };
    const wrapper = mount(() => <LpImage {...props} />);
    await doubleWait();
    expect(wrapper.find('.lp-image__inner').exists()).toBe(true);
    expect(handleLoad).toBeCalled();
  });

  //@todo lazy image test
});
