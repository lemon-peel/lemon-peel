import { nextTick } from 'vue';
import type { ComponentOptions } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import { rAF } from '@lemon-peel/test-utils/tick';
import Drawer from '../src/Drawer.vue';
import Button from '../../button/src/Button.vue';

function doMount(template: string, data: () => any, otherObj?: ComponentOptions) {
  return mount({
    components: {
      [Drawer.name]: Drawer,
      [Button.name]: Button,
    },
    template,
    data,
    ...otherObj,
  });
}

const title = 'Drawer Title';
const content = 'content';

describe('Drawer', () => {
  test('create', async () => {
    const wrapper = doMount(
      `<lp-drawer :title="title" v-model:visible="visible"></lp-drawer>`,
      () => ({ title, visible: true }),
    );
    await nextTick();
    await rAF();
    await nextTick();
    const wrapperEl = wrapper.find('.lp-overlay').element as HTMLDivElement;
    const headerEl = wrapper.find('.lp-drawer__header').element;

    await nextTick();
    expect(wrapperEl.style.display).not.toEqual('none');
    expect(headerEl.textContent).toEqual(title);
  });

  test('render correct content', async () => {
    const wrapper = doMount(
      `<lp-drawer :title='title' v-model:visible='visible'>
        <span>this is a sentence</span>
        <lp-button @click='dialogVisible = false'>cancel</lp-button>
        <lp-button type='primary' @click='dialogVisible = false'>confirm</lp-button>
      </lp-drawer>`,
      () => ({
        title,
        visible: true,
      }),
    );

    await nextTick();
    await rAF();
    await nextTick();
    expect(wrapper.find('.lp-drawer__body span').element.textContent).toEqual(
      'this is a sentence',
    );
    const footerBtns = wrapper.findAll('.lp-button');
    expect(footerBtns.length).toEqual(2);
    expect(footerBtns[0].find('span').element.textContent).toEqual('cancel');
    expect(footerBtns[1].find('span').element.textContent).toEqual('confirm');
  });

  test('should append to body, when append-to-body flag is true', async () => {
    const wrapper = doMount(
      `<lp-drawer ref='d' :title='title' v-model:visible='visible' :append-to-body='true'>
        <span> content </span>
      </lp-drawer>`,
      () => ({
        title,
        visible: false,
      }),
    );
    const vm = wrapper.vm as any;

    vm.visible = true;
    await nextTick();
    await rAF();
    await nextTick();
    expect(document.querySelector('.lp-overlay')?.parentNode).toEqual(
      document.body,
    );
  });

  test('should open and close drawer properly', async () => {
    const onClose = vi.fn();
    const onClosed = vi.fn();
    const onOpened = vi.fn();
    const wrapper = doMount(
      `<lp-drawer :title='title' v-model:visible='visible' @closed="onClosed" @close="onClose" @opened="onOpened">
        <span>${content}</span>
      </lp-drawer>`,
      () => ({
        title,
        visible: false,
      }),
      {
        methods: {
          onOpened,
          onClose,
          onClosed,
        },
      },
    );
    const vm = wrapper.vm as any;
    await nextTick();
    await rAF();
    await nextTick();
    expect(onOpened).not.toHaveBeenCalled();

    const drawerEl = wrapper.find('.lp-overlay').element as HTMLDivElement;
    expect(drawerEl.style.display).toEqual('none');

    vm.visible = true;
    await nextTick();
    await rAF();
    expect(drawerEl.style.display).not.toEqual('none');
    expect(onOpened).toHaveBeenCalled();

    // vm.visible = false
    // await nextTick()
    // await rAF()
    // await nextTick()
    // expect(onClose).toHaveBeenCalled()
  });

  test('should destroy every child after drawer was closed when destroy-on-close flag is true', async () => {
    const wrapper = doMount(
      `<lp-drawer :title='title' v-model:visible='visible' :append-to-body='false' :destroy-on-close='true' ref='drawer'>
        <span>${content}</span>
      </lp-drawer>`,
      () => ({
        title,
        visible: true,
      }),
    );
    const vm = wrapper.vm as any;

    await nextTick();
    await rAF();
    await nextTick();
    expect(wrapper.find('.lp-drawer__body span').element.textContent).toEqual(
      content,
    );
    vm.$refs.drawer.handleClose();
    await nextTick();
    await rAF();
    await nextTick();
    expect(wrapper.find('.lp-drawer__body').exists()).toBe(false);
  });

  test('should close dialog by clicking the close button', async () => {
    const wrapper = doMount(
      `<lp-drawer :title='title' v-model:visible='visible' :append-to-body='false' :destroy-on-close='true' ref='drawer'>
        <span>${content}</span>
      </lp-drawer>`,
      () => ({
        title,
        visible: true,
      }),
    );
    await nextTick();
    await rAF();
    await nextTick();
    const vm = wrapper.vm as any;

    await wrapper.find('.lp-drawer__close-btn').trigger('click');
    await nextTick();
    await rAF();
    await nextTick();
    expect(vm.visible).toEqual(false);
  });

  test('should invoke before-close', async () => {
    const beforeClose = vi.fn();
    const wrapper = doMount(
      `<lp-drawer
          :before-close='beforeClose'
          :title='title'
          v-model:visible='visible'
          :append-to-body='true'
          :destroy-on-close='true'
          ref='drawer'
          >
        <span>${content}</span>
      </lp-drawer>`,
      () => ({
        title,
        visible: true,
        beforeClose,
      }),
    );
    const vm = wrapper.vm as any;
    vm.$refs.drawer.handleClose();

    expect(beforeClose).toHaveBeenCalled();
  });

  test('should not show close button when show-close flag is false', async () => {
    const wrapper = doMount(
      `<lp-drawer :title='title' v-model:visible='visible' ref='drawer' :show-close='false'>
        <span>${content}</span>
      </lp-drawer>`,
      () => ({
        title,
        visible: true,
      }),
    );

    expect(wrapper.find('.lp-drawer__close-btn').exists()).toBe(false);
  });

  test('should have custom classes when custom classes were given', async () => {
    const classes = 'some-custom-class';
    const wrapper = doMount(
      `<lp-drawer :title='title' v-model:visible='visible' ref='drawer' custom-class='${classes}'>
        <span>${content}</span>
      </lp-drawer>`,
      () => ({
        title,
        visible: true,
      }),
    );

    expect(wrapper.find(`.${classes}`).exists()).toBe(true);
  });

  test('drawer header should have slot props', async () => {
    const wrapper = doMount(
      `<lp-drawer v-model:visible='visible' ref='drawer'>
        <template #header="{ titleId, titleClass, close }">
          <button :data-title-id="titleId" :data-title-class="titleClass" @click="close" />
        </template>
      </lp-drawer>`,
      () => ({
        visible: true,
      }),
    );
    await nextTick();
    const drawer = wrapper.findComponent({ ref: 'drawer' });
    const headerButton = wrapper.find('button');
    expect(headerButton.attributes()['data-title-id']).toBeTruthy();
    expect(headerButton.attributes()['data-title-class']).toBe(
      'lp-drawer__title',
    );
    expect(drawer.emitted().close).toBeFalsy();
    headerButton.trigger('click');
    await nextTick();
    expect(drawer.emitted()).toHaveProperty('close');
  });

  test('should not render header when withHeader attribute is false', async () => {
    const wrapper = doMount(
      `<lp-drawer :title='title' v-model:visible='visible' ref='drawer' :with-header='false'>
        <span>${content}</span>
      </lp-drawer>`,
      () => ({
        title,
        visible: true,
      }),
    );

    expect(wrapper.find('.lp-drawer__header').exists()).toBe(false);
  });

  describe('directions', () => {
    const renderer = (direction: string) => {
      return doMount(
        `<lp-drawer :title='title' v-model:visible='visible' direction='${direction}'>
          <span>${content}</span>
        </lp-drawer>`,
        () => ({
          title,
          visible: true,
        }),
      );
    };
    test('should render from left to right', async () => {
      expect(renderer('ltr').find('.ltr').exists()).toBe(true);
    });

    test('should render from right to left', async () => {
      expect(renderer('rtl').find('.rtl').exists()).toBe(true);
    });

    test('should render from top to bottom', async () => {
      expect(renderer('ttb').find('.ttb').exists()).toBe(true);
    });

    test('should render from bottom to top', async () => {
      expect(renderer('btt').find('.btt').exists()).toBe(true);
    });
  });

  test('events', async () => {
    const open = vi.fn();
    const opened = vi.fn();
    const close = vi.fn();
    const closed = vi.fn();
    const wrapper = doMount(
      `<lp-drawer
        :title='title'
        v-model:visible='visible'
        ref="drawer"
        @open="open"
        @opened="opened"
        @close="close"
        @closed="closed">
        <span>${content}</span>
      </lp-drawer>`,
      () => ({
        title,
        visible: false,
      }),
      {
        methods: {
          close,
          closed,
          open,
          opened,
        },
      },
    );
    const vm = wrapper.vm as any;
    const drawer = wrapper.vm.$refs.drawer as any;

    vm.visible = true;
    await nextTick();
    await nextTick();
    expect(open).toHaveBeenCalled();
    drawer.afterEnter();
    expect(opened).toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
    expect(closed).not.toHaveBeenCalled();

    vm.visible = false;
    await nextTick();
    expect(close).toHaveBeenCalled();
    drawer.afterLeave();
    expect(closed).toHaveBeenCalled();
  });

  describe('size', () => {
    const renderer = (size: string, isVertical: boolean) =>
      doMount(
        `<lp-drawer :title='title' v-model:visible='visible' direction='${isVertical ? 'ltr' : 'ttb'}' size='${size}'>
          <span>${content}</span>
        </lp-drawer>`,
        () => ({
          visible: true,
          title,
        }),
      );

    test('should effect height when drawer is vertical', async () => {
      const drawerEl = renderer('50%', true).find('.lp-drawer')
        .element as HTMLDivElement;
      expect(drawerEl.style.width).toEqual('50%');
    });

    test('should effect width when drawer is horizontal', async () => {
      const drawerEl = renderer('50%', false).find('.lp-drawer')
        .element as HTMLDivElement;
      expect(drawerEl.style.height).toEqual('50%');
    });
  });

  describe('accessibility', () => {
    test('title attribute should set aria-label', async () => {
      const wrapper = doMount(
        `<lp-drawer
          :title='title'
          v-model:visible='visible'
          ref="drawer">
        </lp-drawer>`,
        () => ({
          title,
          visible: true,
        }),
      );
      await nextTick();
      const drawerDialog = wrapper.find('[role="dialog"]');
      expect(drawerDialog.attributes()['aria-label']).toBe(title);
      expect(drawerDialog.attributes()['aria-labelledby']).toBeFalsy();
    });

    test('missing title attribute should point to header slot content', async () => {
      const wrapper = doMount(
        `<lp-drawer
          v-model:visible='visible'
          ref="drawer">
          <template #header="{ titleId, titleClass }">
            <h5 :id="titleId" :class="titleClass" />
          </template>
        </lp-drawer>`,
        () => ({
          visible: true,
        }),
      );
      await nextTick();
      const drawerDialog = wrapper.find('[role="dialog"]');
      const drawerTitle = wrapper.find('.lp-drawer__title');
      expect(drawerDialog.attributes()['aria-label']).toBeFalsy();
      expect(drawerDialog.attributes()['aria-labelledby']).toBe(
        drawerTitle.attributes().id,
      );
    });

    test('aria-describedby should point to modal body', async () => {
      const wrapper = doMount(
        `<lp-drawer
          v-model:visible='visible'
          ref="drawer">
          <span>${content}</span>
        </lp-drawer>`,
        () => ({
          visible: true,
        }),
      );
      await nextTick();
      const drawerDialog = wrapper.find('[role="dialog"]');
      const drawerBody = wrapper.find('.lp-drawer__body');
      expect(drawerDialog.attributes()['aria-describedby']).toBe(
        drawerBody.attributes().id,
      );
    });
  });
});
