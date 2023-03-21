import { markRaw, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import { rAF } from '@lemon-peel/test-utils/tick';
import { Delete } from '@element-plus/icons-vue';
import { merge } from 'lodash-es';
import type { ComponentMountingOptions } from 'packages/test-utils/makeMount';
import triggerCompositeClick from '@lemon-peel/test-utils/compositeClick';

import Dialog from '../src/Dialog.vue';

const AXIOM = 'Rem is the best girl';
type DialogMountingOptions = ComponentMountingOptions<typeof Dialog>;

const defaultProps: DialogMountingOptions['props'] = {
  visible: true,
  vSlots: { default: () => (AXIOM) },
};

function doMount(
  props: DialogMountingOptions['props'] = {},
  options: DialogMountingOptions = {},
) {
  return mount(
    () => <Dialog {...merge(defaultProps, props)} />,
    { attachTo: 'body', ...options },
  );
}

describe('Dialog.vue', () => {
  test('render test', async () => {
    const wrapper = doMount();

    await nextTick();
    await rAF();
    await nextTick();
    expect(wrapper.find('.lp-dialog__body').text()).toEqual(AXIOM);
  });

  test('dialog should have a title and header when it has been given', async () => {
    const HEADER = 'I am header';
    const wrapper = doMount({ vSlots: { header: () => HEADER } });

    await nextTick();
    expect(wrapper.find('.lp-dialog__header').text()).toBe(HEADER);

    mount(() => <Dialog visible={true} title={HEADER}>{AXIOM}</Dialog>);
    await nextTick();

    expect(wrapper.find('.lp-dialog__header').text()).toBe(HEADER);
  });

  test('dialog header should have slot props', async () => {
    const wrapper = doMount({
      vSlots: {
        header: ({ titleId, titleClass, close }: { titleId: string, titleClass: string, close: () => void }) => (
          <button data-title-id={titleId} data-title-class={titleClass} onClick={close} />
        ),
      },
    });

    await nextTick();
    const headerButton = wrapper.find('button');
    expect(headerButton.attributes()['data-title-id']).toBeTruthy();
    expect(headerButton.attributes()['data-title-class']).toBe('lp-dialog__title');
    expect(wrapper.emitted().close).toBeFalsy();
    headerButton.trigger('click');
    await nextTick();
    expect(wrapper.emitted()).toHaveProperty('close');
  });

  test('dialog should have a footer when footer has been given', async () => {
    const wrapper = doMount({
      vSlots: { footer: () => AXIOM },
    });

    await nextTick();
    expect(wrapper.find('.lp-dialog__footer').exists()).toBe(true);
    expect(wrapper.find('.lp-dialog__footer').text()).toBe(AXIOM);
  });

  test('should append dialog to body when appendToBody is true', async () => {
    const wrapper = doMount({ props: { appendToBody: true } });

    await nextTick();
    expect(
      document.body.firstElementChild!.classList.contains('lp-overlay'),
    ).toBe(true);
    wrapper.unmount();
  });

  test('should center dialog', async () => {
    const wrapper = doMount({ props: { center: true } });

    await nextTick();
    expect(wrapper.find('.lp-dialog--center').exists()).toBe(true);
  });

  test('should show close button', async () => {
    const wrapper = doMount({});

    await nextTick();
    expect(wrapper.find('.lp-dialog__close').exists()).toBe(true);
  });

  test('should hide close button when showClose = false', async () => {
    const wrapper = doMount({ props: { showClose: false } });

    await nextTick();
    expect(wrapper.find('.lp-dialog__headerbtn').exists()).toBe(false);
  });

  test('should close dialog when click on close button', async () => {
    const wrapper = doMount({});

    await nextTick();
    await wrapper.find('.lp-dialog__headerbtn').trigger('click');
    expect(wrapper.vm.visible).toBe(false);
  });

  describe('mask related', () => {
    test('should not have overlay mask when mask is false', async () => {
      const wrapper = doMount({ props: { modal: false } });

      await nextTick();
      expect(wrapper.find('.lp-overlay').exists()).toBe(false);
    });

    test('should close the modal when clicking on mask when `closeOnClickModal` is true', async () => {
      const wrapper = doMount({});

      await nextTick();
      expect(wrapper.find('.lp-overlay').exists()).toBe(true);
      expect(wrapper.find('.lp-overlay-dialog').exists()).toBe(true);

      await triggerCompositeClick(wrapper.find('.lp-overlay-dialog'));
      expect(wrapper.vm.visible).toBe(false);
    });
  });

  describe('life cycles', () => {
    test('should call before close', async () => {
      const beforeClose = vi.fn();
      const wrapper = doMount({ props: { beforeClose } });

      await nextTick();
      await wrapper.find('.lp-dialog__headerbtn').trigger('click');
      expect(beforeClose).toHaveBeenCalled();
    });

    test('should not close dialog when user cancelled', async () => {
      const beforeClose = vi
        .fn()
        .mockImplementation((hide: (cancel: boolean) => void) => hide(true));

      const wrapper = doMount({ props: { beforeClose } });
      await nextTick();
      await wrapper.find('.lp-dialog__headerbtn').trigger('click');
      expect(beforeClose).toHaveBeenCalled();
      expect(wrapper.vm.visible).toBe(true);
    });

    test('should open and close with delay', async () => {
      const visible = ref(true);
      const wrapper = mount(
        () => <Dialog visible={visible.value} vSlots={defaultProps.vSlots} openDelay={200} closeDelay={200} />,
        { attachTo: 'body' },
      );

      const dialog = wrapper.findComponent(Dialog);
      expect(dialog.vm.isVisible).toBe(false);
    });

    test('should destroy on close', async () => {
      const visible = ref(true);
      const wrapper = mount(
        () => <Dialog visible={visible.value} destroyOnClose={true} vSlots={defaultProps.vSlots} />,
        { attachTo: 'body' },
      );
      const dialog = wrapper.findComponent(Dialog);
      expect(dialog.vm.isVisible).toBe(true);
      await nextTick();
      await rAF();
      await nextTick();
      await wrapper.find('.lp-dialog__headerbtn').trigger('click');
      visible.value = false;
      await nextTick();
      await rAF();
      await nextTick();
      expect(wrapper.find('.lp-dialog__body').exists()).toBe(false);
    });

    test('should emit close event', async () => {
      let visible = true;
      const onClose = vi.fn();
      const onClosed = vi.fn();
      const wrapper = doMount({
        onClose,
        onClosed,
        ['onUpdate:visible']: (value: boolean) => (visible = value),
      });

      const dialog = wrapper.findComponent(Dialog);
      expect(dialog.vm.isVisible).toBe(true);
      await nextTick();
      await rAF();
      await nextTick();

      await triggerCompositeClick(wrapper.find('.lp-overlay-dialog'));
      await nextTick();
      await rAF();
      await nextTick();
      expect(onClose).toHaveBeenCalled();
      expect(onClosed).toHaveBeenCalled();
      expect(visible).toBe(false);
    });

    test('closeIcon', async () => {
      const wrapper = doMount({ props: { closeIcon: markRaw(Delete) } });
      await nextTick();
      await rAF();
      const closeIcon = wrapper.find('svg');
      expect(closeIcon.exists()).toBe(true);
      const svg = mount(Delete).find('svg').element;
      expect(closeIcon.element.innerHTML).toBe(svg.innerHTML);
    });

    test('should render draggable prop', async () => {
      const wrapper = doMount({ props: { draggable: true } });

      await nextTick();
      await rAF();
      await nextTick();
      expect(wrapper.find('.is-draggable').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    test('title attribute should set aria-label', async () => {
      const title = 'Hello World';
      const wrapper = doMount({ props: { title } });
      await nextTick();
      const dialog = wrapper.find('[role="dialog"]');
      expect(dialog.attributes()['aria-label']).toBe(title);
      expect(dialog.attributes()['aria-labelledby']).toBeFalsy();
    });

    test('missing title attribute should point to header slot content', async () => {
      const wrapper = doMount({
        vSlots: {
          header: ({
            titleId,
            titleClass,
          }: {
            titleId: string;
            titleClass: string;
          }) => <h5 id={titleId} class={titleClass} />,
        },
      });
      await nextTick();
      const dialog = wrapper.find('[role="dialog"]');
      const dialogTitle = wrapper.find('.lp-dialog__title');
      expect(dialog.attributes()['aria-label']).toBeFalsy();
      expect(dialog.attributes()['aria-labelledby']).toBe(
        dialogTitle.attributes().id,
      );
    });

    test('aria-describedby should point to modal body', async () => {
      const wrapper = mount(() => <Dialog visible={true}>{AXIOM}</Dialog>);
      await nextTick();
      const dialog = wrapper.find('[role="dialog"]');
      const dialogBody = wrapper.find('.lp-dialog__body');
      expect(dialog.attributes()['aria-describedby'])
        .toBe(dialogBody.attributes().id);
    });
  });
});
