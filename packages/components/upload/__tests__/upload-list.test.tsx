import { describe, expect, test, vi } from 'vitest';
import { EVENT_CODE } from '@lemon-peel/constants';

import makeMount from '@lemon-peel/test-utils/make-mount';
import UploadList from '../src/UploadList.vue';

const testName = 'test name';

const mount = makeMount(UploadList, {
  props: {
    files: [new File([], testName)],
  },
});

describe('<upload-list />', () => {
  describe('render test', () => {
    test('should render correct', () => {
      const wrapper = mount({
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
      const wrapper = mount({
        props: {
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

      const wrapper = mount({
        props: {
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
