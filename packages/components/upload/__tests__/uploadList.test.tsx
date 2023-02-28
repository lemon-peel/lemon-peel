// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { describe, expect, test, vi } from 'vitest';
import { EVENT_CODE } from '@lemon-peel/constants';

import UploadList from '../src/UploadList.vue';
import { mount } from '@vue/test-utils';
import type { UploadFile } from '../src/upload';

const testName = 'test name';

// TODO remove as any
const defaultFiles = [{
  name: testName,
  raw: new File([], testName),
} as UploadFile];

describe('<upload-list />', () => {
  describe('render test', () => {
    test('should render correct', () => {
      const wrapper = mount(UploadList, {
        props: {
          files: defaultFiles as UploadFile[],
        },
        slots: {
          default: ({ file }: { file: File }) => <div>{file.name}</div>,
        },
      });
      expect(wrapper.text()).toBe(testName);
    });
  });

  describe('functionalities', () => {
    test('handle preview works', async () => {
      const preview = vi.fn();

      const wrapper = mount(UploadList, {
        props: {
          files: defaultFiles as UploadFile[],
          handlePreview: preview,
        },
      });

      await wrapper.find('.lp-upload-list__item-name').trigger('click');
      expect(preview).toHaveBeenCalled();

      await wrapper.setProps({
        listType: 'picture-card',
      });

      await wrapper.find('.lp-upload-list__item-preview').trigger('click');
      expect(preview).toHaveBeenCalledTimes(2);
    });

    test('handle delete works', async () => {
      const remove = vi.fn();


      const wrapper = mount(UploadList, {
        props: {
          files: defaultFiles as UploadFile[],
          onRemove: remove,
        },
      });

      await wrapper.find('.lp-icon--close').trigger('click');
      expect(remove).toHaveBeenCalled();

      await wrapper.find('.lp-upload-list__item').trigger('keydown', {
        key: EVENT_CODE.delete,
      });

      expect(remove).toHaveBeenCalledTimes(2);

      await wrapper.setProps({
        listType: 'picture-card',
      });

      await wrapper.find('.lp-upload-list__item-delete').trigger('click');
      expect(remove).toHaveBeenCalledTimes(3);
    });
  });
});
