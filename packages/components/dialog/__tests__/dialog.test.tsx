import { markRaw, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi, afterEach } from 'vitest';
import { rAF } from '@lemon-peel/test-utils/tick';
import { Delete } from '@element-plus/icons-vue';

import triggerCompositeClick from '@lemon-peel/test-utils/compositeClick';

import type { VueWrapper } from '@vue/test-utils';

import Dialog from '../src/Dialog.vue';

const AXIOM = 'Rem is the best girl';

let wrapper: VueWrapper<any>;

afterEach(() => {
  wrapper?.unmount();
  document.body.innerHTML = '';
});

describe('Dialog.vue', () => {

  test('render test', async () => {
    wrapper = mount(() => <Dialog visible={true}>{AXIOM}</Dialog>);

    await nextTick();
    await rAF();
    await nextTick();
    expect(wrapper.find('.lp-dialog__body').text()).toEqual(AXIOM);
  });

  test('dialog should have a title and header when it has been given', async () => {
    const HEADER = 'I am header';
    wrapper = mount(() => <Dialog visible={true} vSlots={{ header: () => HEADER }}>{AXIOM}</Dialog>);

    await nextTick();
    expect(wrapper.find('.lp-dialog__header').text()).toBe(HEADER);

    mount(() => <Dialog visible={true} title={HEADER}>{AXIOM}</Dialog>);
    await nextTick();

    expect(wrapper.find('.lp-dialog__header').text()).toBe(HEADER);
  });

  test('dialog header should have slot props', async () => {
    wrapper = mount(() => <Dialog visible={true} vSlots={{
      header: ({ titleId, titleClass, close }: { titleId: string, titleClass: string, close: () => void }) => (
          <button data-title-id={titleId} data-title-class={titleClass} onClick={close} />
      ),
    }}>{AXIOM}</Dialog>);

    await nextTick();
    const headerButton = wrapper.find('button');
    expect(headerButton.attributes()['data-title-id']).toBeTruthy();
    expect(headerButton.attributes()['data-title-class']).toBe('lp-dialog__title');
    expect(wrapper.emitted().close).toBeFalsy();
    headerButton.trigger('click');
    await nextTick();
    const dialog = wrapper.findComponent(Dialog);
    expect(dialog.emitted()).toHaveProperty('close');
  });

  test('dialog should have a footer when footer has been given', async () => {
    wrapper = mount(() => <Dialog visible={true} vSlots={{ footer: () => AXIOM }}>{AXIOM}</Dialog>);

    await nextTick();
    expect(wrapper.find('.lp-dialog__footer').exists()).toBe(true);
    expect(wrapper.find('.lp-dialog__footer').text()).toBe(AXIOM);
  });

  test('should append dialog to body when appendToBody is true', async () => {
    wrapper = mount(() => <Dialog visible={true} appendToBody={true}>{AXIOM}</Dialog>);

    await nextTick();

    expect(
      document.body.firstElementChild!.classList.contains('lp-overlay'),
    ).toBe(true);
  });

  test('should center dialog', async () => {
    wrapper = mount(() => <Dialog visible={true} center={true}>{AXIOM}</Dialog>);

    await nextTick();

    expect(wrapper.find('.lp-dialog--center').exists()).toBe(true);
  });

  test('should show close button', async () => {
    wrapper = mount(() => <Dialog visible={true}>{AXIOM}</Dialog>);

    await nextTick();
    expect(wrapper.find('.lp-dialog__close').exists()).toBe(true);
  });

  test('should hide close button when showClose = false', async () => {
    wrapper = mount(() => <Dialog visible={true} showClose={false}>{AXIOM}</Dialog>);

    await nextTick();
    expect(wrapper.find('.lp-dialog__headerbtn').exists()).toBe(false);
  });

  test('should close dialog when click on close button', async () => {
    const visible = ref(true);
    wrapper = mount(
      () => <Dialog v-model:visible={visible.value}>{AXIOM}</Dialog>,
      { attachTo: 'body' },
    );

    await nextTick();
    await wrapper.find('.lp-dialog__headerbtn').trigger('click');
    await rAF();
    expect(visible.value).toBe(false);
  });

  describe('mask related', () => {
    test('should not have overlay mask when mask is false', async () => {
      wrapper = mount(() => <Dialog visible={true} modal={false}>{AXIOM}</Dialog>);

      await nextTick();
      expect(wrapper.find('.lp-overlay').exists()).toBe(false);
    });

    test('should close the modal when clicking on mask when `closeOnClickModal` is true', async () => {
      wrapper = mount(() => <Dialog visible={true}>{AXIOM}</Dialog>);
      await nextTick();

      const dialog = wrapper.findComponent(Dialog);
      expect(dialog.vm.isVisible).toBe(true);
      expect(dialog.find('.lp-overlay').exists()).toBe(true);
      expect(dialog.find('.lp-overlay-dialog').exists()).toBe(true);

      await triggerCompositeClick(wrapper.find('.lp-overlay-dialog'));
      expect(dialog.vm.isVisible).toBe(false);
    });
  });

  describe('life cycles', () => {
    test('should call before close', async () => {
      const beforeClose = vi.fn();
      wrapper = mount(() => <Dialog visible={true} beforeClose={beforeClose}>{AXIOM}</Dialog>);

      await nextTick();
      await wrapper.find('.lp-dialog__headerbtn').trigger('click');
      expect(beforeClose).toHaveBeenCalled();
    });

    test('should not close dialog when user cancelled', async () => {
      const beforeClose = vi
        .fn()
        .mockImplementation((hide: (cancel: boolean) => void) => hide(true));

      wrapper = mount(() => <Dialog visible={true} beforeClose={beforeClose}>{AXIOM}</Dialog>);
      await nextTick();
      await wrapper.find('.lp-dialog__headerbtn').trigger('click');
      expect(beforeClose).toHaveBeenCalled();
      const dialog = wrapper.findComponent(Dialog);
      expect(dialog.vm.isVisible).toBe(true);
    });

    test('should open and close with delay', async () => {
      const visible = ref(false);
      wrapper = mount(() => <Dialog visible={visible.value} openDelay={200} closeDelay={200}>{AXIOM}</Dialog>);

      const dialog = wrapper.findComponent(Dialog);
      visible.value = true;
      expect(dialog.vm.isVisible).toBe(false);
    });

    test('should destroy on close', async () => {
      const visible = ref(true);
      wrapper = mount(() => <Dialog visible={visible.value} destroyOnClose={true}>{AXIOM}</Dialog>);
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
      const visible = ref(true);
      const onClose = vi.fn();
      const onClosed = vi.fn();
      wrapper = mount(() => <Dialog v-model:visible={visible.value} onClose={onClose} onClosed={onClosed}>{AXIOM}</Dialog>);

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
      expect(visible.value).toBe(false);
    });

    test('closeIcon', async () => {
      wrapper = mount(() => <Dialog visible={true} closeIcon={markRaw(Delete)}>{AXIOM}</Dialog>);
      await nextTick();
      await rAF();
      const closeIcon = wrapper.find('svg');
      expect(closeIcon.exists()).toBe(true);
      const svg = mount(Delete).find('svg').element;
      expect(closeIcon.element.innerHTML).toBe(svg.innerHTML);
    });

    test('should render draggable prop', async () => {
      wrapper = mount(() => <Dialog visible={true} draggable={true}>{AXIOM}</Dialog>);
      await nextTick();
      await rAF();
      await nextTick();
      expect(wrapper.find('.is-draggable').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    test('title attribute should set aria-label', async () => {
      const title = 'Hello World';
      wrapper = mount(() => <Dialog visible={true} title={title}>{AXIOM}</Dialog>);
      await nextTick();
      const dialog = wrapper.find('[role="dialog"]');
      expect(dialog.attributes()['aria-label']).toBe(title);
      expect(dialog.attributes()['aria-labelledby']).toBeFalsy();
    });

    test('missing title attribute should point to header slot content', async () => {
      wrapper = mount(() => <Dialog visible={true} vSlots={{
        header: ({
          titleId,
          titleClass,
        }: {
          titleId: string;
          titleClass: string;
        }) => <h5 id={titleId} class={titleClass} />,
      }}>{AXIOM}</Dialog>);

      await nextTick();
      const dialog = wrapper.find('[role="dialog"]');
      const dialogTitle = wrapper.find('.lp-dialog__title');
      expect(dialog.attributes()['aria-label']).toBeFalsy();
      expect(dialog.attributes()['aria-labelledby']).toBe(
        dialogTitle.attributes().id,
      );
    });

    test('aria-describedby should point to modal body', async () => {
      wrapper = mount(() => <Dialog visible={true}>{AXIOM}</Dialog>);
      await nextTick();
      const dialog = wrapper.find('[role="dialog"]');
      const dialogBody = wrapper.find('.lp-dialog__body');
      expect(dialog.attributes()['aria-describedby'])
        .toBe(dialogBody.attributes().id);
    });
  });
});
