
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { rAF } from '@lemon-peel/test-utils/tick';
import { EVENT_CODE } from '@lemon-peel/constants';
import { LpTooltip } from '@lemon-peel/components/tooltip';
import Button from '@lemon-peel/components/button';
import { POPPER_CONTAINER_SELECTOR } from '@lemon-peel/hooks/src';
import Dropdown from '../src/Dropdown.vue';
import DropdownItem from '../src/DropdownItem.vue';
import DropdownMenu from '../src/DropdownMenu.vue';

import type { ComponentOptions } from 'vue';

const MOUSE_ENTER_EVENT = 'mouseenter';
const MOUSE_LEAVE_EVENT = 'mouseleave';
const CONTEXTMENU = 'contextmenu';

const doMount = (template: string, data: () => any, otherObj?: ComponentOptions) =>
  mount({
    components: {
      [Button.name]: Button,
      [Dropdown.name]: Dropdown,
      [DropdownItem.name]: DropdownItem,
      [DropdownMenu.name]: DropdownMenu,
    },
    template,
    data,
    ...otherObj,
  });

describe('Dropdown', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('create', async () => {
    const wrapper = doMount(
      `
        <lp-dropdown ref="b" placement="right">
          <span class="lp-dropdown-link" ref="a">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
          <template #dropdown>
            <lp-dropdown-menu>
              <lp-dropdown-item>Apple</lp-dropdown-item>
              <lp-dropdown-item>Orange</lp-dropdown-item>
              <lp-dropdown-item>Cherry</lp-dropdown-item>
              <lp-dropdown-item disabled>Peach</lp-dropdown-item>
              <lp-dropdown-item divided>Pear</lp-dropdown-item>
            </lp-dropdown-menu>
          </template>
        </lp-dropdown>
      `,
      () => ({}),
    );
    await nextTick();
    const content = wrapper.findComponent(LpTooltip).vm as InstanceType<
      typeof LpTooltip
    >;

    vi.useFakeTimers();
    const triggerElm = wrapper.find('.lp-tooltip__trigger');
    expect(content.open).toBe(false);
    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    vi.runAllTimers();
    expect(content.open).toBe(true);
    await triggerElm.trigger(MOUSE_LEAVE_EVENT);
    vi.runAllTimers();
    expect(content.open).toBe(false);
    vi.useRealTimers();
  });

  test('menu click', async () => {
    const commandHandler = vi.fn();
    const wrapper = doMount(
      `
      <lp-dropdown ref="b" @command="commandHandler" placement="right">
        <span class="lp-dropdown-link" ref="a">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item command="a">Apple</lp-dropdown-item>
            <lp-dropdown-item command="b">Orange</lp-dropdown-item>
            <lp-dropdown-item ref="c" :command="myCommandObject">Cherry</lp-dropdown-item>
            <lp-dropdown-item command="d">Peach</lp-dropdown-item>
            <lp-dropdown-item command="e">Pear</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({
        myCommandObject: { name: 'CommandC' },
        name: '',
      }),
      {
        methods: {
          commandHandler,
        },
      },
    );
    await nextTick();
    // const content = wrapper.findComponent({ ref: 'b' }).vm as any
    const triggerElm = wrapper.find('.lp-tooltip__trigger');
    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    await nextTick();
    await wrapper
      .findComponent({ ref: 'c' })
      .findComponent({
        name: 'DropdownItemImpl',
      })
      .find('.lp-dropdown-menu__item')
      .trigger('click');
    await nextTick();
    expect(commandHandler).toHaveBeenCalled();
  });

  test('trigger', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown trigger="click" ref="b" placement="right">
        <span class="lp-dropdown-link" ref="a">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item command="a">Apple</lp-dropdown-item>
            <lp-dropdown-item command="b">Orange</lp-dropdown-item>
            <lp-dropdown-item ref="c" :command="myCommandObject">Cherry</lp-dropdown-item>
            <lp-dropdown-item command="d">Peach</lp-dropdown-item>
            <lp-dropdown-item command="e">Pear</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({
        myCommandObject: { name: 'CommandC' },
        name: '',
      }),
    );
    await nextTick();
    const content = wrapper.findComponent(LpTooltip).vm as InstanceType<
      typeof LpTooltip
    >;
    const triggerElm = wrapper.find('.lp-dropdown-link');
    expect(content.open).toBe(false);
    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    expect(content.open).toBe(false);
    await triggerElm.trigger('click', {
      button: 0,
    });
    await rAF();
    expect(content.open).toBe(true);
  });

  test('trigger contextmenu', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown trigger="contextmenu" ref="b" placement="right">
        <span class="lp-dropdown-link" ref="a">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item command="a">Apple</lp-dropdown-item>
            <lp-dropdown-item command="b">Orange</lp-dropdown-item>
            <lp-dropdown-item ref="c" :command="myCommandObject">Cherry</lp-dropdown-item>
            <lp-dropdown-item command="d">Peach</lp-dropdown-item>
            <lp-dropdown-item command="e">Pear</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({
        myCommandObject: { name: 'CommandC' },
        name: '',
      }),
    );
    await nextTick();
    const content = wrapper.findComponent(LpTooltip).vm as InstanceType<
      typeof LpTooltip
    >;
    const triggerElm = wrapper.find('.lp-dropdown-link');
    expect(content.open).toBe(false);
    await triggerElm.trigger(CONTEXTMENU);
    await rAF();
    expect(content.open).toBe(true);
  });

  test('handleOpen and handleClose', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown trigger="click" ref="refDropdown" placement="right">
        <span class="lp-dropdown-link" ref="a">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item command="a">Apple</lp-dropdown-item>
            <lp-dropdown-item command="b">Orange</lp-dropdown-item>
            <lp-dropdown-item command="c">Cherry</lp-dropdown-item>
            <lp-dropdown-item command="d">Peach</lp-dropdown-item>
            <lp-dropdown-item command="e">Pear</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({
        name: '',
      }),
    );
    await nextTick();
    const dropdown = wrapper.vm;
    const content = wrapper.findComponent(LpTooltip).vm as InstanceType<
      typeof LpTooltip
    >;
    expect(content.open).toBe(false);
    await dropdown.$refs.refDropdown.handleOpen();
    await rAF();
    expect(content.open).toBe(true);
    await dropdown.$refs.refDropdown.handleClose();
    await rAF();
    expect(content.open).toBe(false);
  });

  test('split button', async () => {
    const handleClick = vi.fn();
    const wrapper = doMount(
      `
      <lp-dropdown  @click="handleClick" split-button type="primary" ref="b" placement="right">
        dropdown
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item command="a">Apple</lp-dropdown-item>
            <lp-dropdown-item command="b">Orange</lp-dropdown-item>
            <lp-dropdown-item ref="c" :command="myCommandObject">Cherry</lp-dropdown-item>
            <lp-dropdown-item command="d">Peach</lp-dropdown-item>
            <lp-dropdown-item command="e">Pear</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({
        myCommandObject: { name: 'CommandC' },
        name: '',
      }),
      {
        methods: {
          handleClick,
        },
      },
    );
    await nextTick();
    const content = wrapper.findComponent(LpTooltip).vm as InstanceType<
      typeof LpTooltip
    >;
    const triggerElm = wrapper.find('.lp-dropdown__caret-button');
    const button = wrapper.find('.lp-button');
    expect(content.open).toBe(false);
    await button.trigger('click');
    expect(handleClick).toHaveBeenCalled();
    vi.useFakeTimers();
    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    vi.runAllTimers();
    vi.useRealTimers();
    expect(content.open).toBe(true);
  });

  test('hide on click', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown ref="b" placement="right" :hide-on-click="false">
        <span class="lp-dropdown-link" ref="a">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item>Apple</lp-dropdown-item>
            <lp-dropdown-item>Orange</lp-dropdown-item>
            <lp-dropdown-item ref="c">Cherry</lp-dropdown-item>
            <lp-dropdown-item disabled>Peach</lp-dropdown-item>
            <lp-dropdown-item divided>Pear</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({}),
    );
    await nextTick();
    const content = wrapper.findComponent(LpTooltip).vm as InstanceType<
      typeof LpTooltip
    >;
    expect(content.open).toBe(false);
    const triggerElm = wrapper.find('.lp-tooltip__trigger');
    vi.useFakeTimers();
    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    vi.runAllTimers();
    expect(content.open).toBe(true);
    await wrapper
      .findComponent({ ref: 'c' })
      .findComponent({
        name: 'DropdownItemImpl',
      })
      .trigger('click');
    vi.runAllTimers();
    expect(content.open).toBe(true);
    vi.useRealTimers();
  });

  test('triggerElm keydown', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown ref="b" placement="right" :hide-on-click="false">
        <span class="lp-dropdown-link" ref="a">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item>Apple</lp-dropdown-item>
            <lp-dropdown-item>Orange</lp-dropdown-item>
            <lp-dropdown-item ref="c">Cherry</lp-dropdown-item>
            <lp-dropdown-item disabled>Peach</lp-dropdown-item>
            <lp-dropdown-item divided>Pear</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({}),
    );
    await nextTick();
    const content = wrapper.findComponent(LpTooltip).vm as InstanceType<
      typeof LpTooltip
    >;
    const triggerElm = wrapper.find('.lp-tooltip__trigger');

    vi.useFakeTimers();
    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    vi.runAllTimers();
    await triggerElm.trigger('keydown', {
      code: EVENT_CODE.enter,
    });
    vi.runAllTimers();
    expect(content.open).toBe(false);

    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    vi.runAllTimers();
    await triggerElm.trigger('keydown', {
      code: EVENT_CODE.tab,
    });
    vi.runAllTimers();
    expect(content.open).toBe(true);
    vi.useRealTimers();
  });

  test('dropdown menu keydown', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown ref="b" placement="right" :hide-on-click="false">
        <span class="lp-dropdown-link" ref="a">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
        <template #dropdown>
          <lp-dropdown-menu ref="dropdown-menu">
            <lp-dropdown-item ref="d">Apple</lp-dropdown-item>
            <lp-dropdown-item>Orange</lp-dropdown-item>
            <lp-dropdown-item ref="c">Cherry</lp-dropdown-item>
            <lp-dropdown-item disabled>Peach</lp-dropdown-item>
            <lp-dropdown-item divided>Pear</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({}),
    );
    await nextTick();
    const content = wrapper.findComponent({ ref: 'dropdown-menu' });
    const triggerElm = wrapper.find('.lp-tooltip__trigger');
    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    await rAF();
    await content.trigger('keydown', {
      code: EVENT_CODE.down,
    });
    await rAF();
    expect(
      wrapper
        .findComponent({ ref: 'd' })
        .findComponent({
          name: 'DropdownItemImpl',
        })
        .find('.lp-dropdown-menu__item')
        .element.getAttribute('tabindex'),
    ).toBe('0');
  });

  test('max height', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown ref="b" max-height="60px">
        <span class="lp-dropdown-link" ref="a">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item>Apple</lp-dropdown-item>
            <lp-dropdown-item>Orange</lp-dropdown-item>
            <lp-dropdown-item>Cherry</lp-dropdown-item>
            <lp-dropdown-item disabled>Peach</lp-dropdown-item>
            <lp-dropdown-item divided>Pear</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({}),
    );
    await nextTick();
    const scrollbar = wrapper
      .findComponent({
        ref: 'b',
      })
      .findComponent({ ref: 'scrollbar' });
    expect(scrollbar.find('.lp-scrollbar__wrap').attributes('style')).toContain(
      'max-height: 60px;',
    );
  });

  test('tooltip debounce', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown ref="b">
        <span class="lp-dropdown-link">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item>Apple</lp-dropdown-item>
            <lp-dropdown-item>Orange</lp-dropdown-item>
            <lp-dropdown-item>Cherry</lp-dropdown-item>
            <lp-dropdown-item>Peach</lp-dropdown-item>
            <lp-dropdown-item>Pear</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({}),
    );
    const content = wrapper.findComponent(LpTooltip).vm as InstanceType<
      typeof LpTooltip
    >;
    const triggerElm = wrapper.find('.lp-tooltip__trigger');
    expect(content.open).toBe(false);

    vi.useFakeTimers();
    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    await triggerElm.trigger(MOUSE_LEAVE_EVENT);
    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    vi.runAllTimers();
    vi.useRealTimers();
    expect(content.open).toBe(true);
  });

  test('popperClass', async () => {
    const wrapper = await doMount(
      `
      <lp-dropdown ref="b" max-height="60px" popper-class="custom-popper-class">
        <span class="lp-dropdown-link" ref="a">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item>Apple</lp-dropdown-item>
            <lp-dropdown-item>Orange</lp-dropdown-item>
            <lp-dropdown-item>Cherry</lp-dropdown-item>
            <lp-dropdown-item disabled>Peach</lp-dropdown-item>
            <lp-dropdown-item divided>Pear</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({}),
    );

    const popperElement = wrapper.findComponent({
      name: 'LpPopperContent',
    }).element;

    expect(popperElement.classList.contains('custom-popper-class')).toBe(true);
  });

  test('custom attributes for dropdown items', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown>
        <span class="lp-dropdown-link">
          Custom Attributes
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item data-custom-attribute="hello">Item</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({}),
    );
    await nextTick();
    expect((wrapper
      .findComponent({
        name: 'DropdownItemImpl',
      })
      .find('.lp-dropdown-menu__item').element as HTMLElement).dataset.customAttribute,
    ).toBe('hello');
  });

  test('disable normal dropdown', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown disabled>
        <span class="lp-dropdown-link">
          Dropdown List
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item data-custom-attribute="hello">Item</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({}),
    );
    await nextTick();
    expect(
      wrapper
        .findComponent({
          name: 'LpDropdown',
        })
        .classes(),
    ).toContain('is-disabled');
  });
  test('disable dropdown with split button', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown disabled split-button>
        <span class="lp-dropdown-link">
          Dropdown List
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item data-custom-attribute="hello">Item</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({}),
    );
    await nextTick();
    expect(
      wrapper
        .findAllComponents({
          name: 'LpButton',
        })[0]
        .classes(),
    ).toContain('is-disabled');
    expect(
      wrapper
        .findAllComponents({
          name: 'LpButton',
        })[1]
        .classes(),
    ).toContain('is-disabled');
  });

  test('set show-timeout/hide-timeout when trigger is hover', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown trigger="hover" :show-timeout="200" :hide-timeout="300">
        <span class="lp-dropdown-link">
          Dropdown List
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item>Item</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({}),
    );
    const tooltipElement = wrapper.getComponent({
      name: 'LpTooltip',
    });
    expect(tooltipElement.vm.showAfter).toBe(200);
    expect(tooltipElement.vm.hideAfter).toBe(300);
  });

  test('ignore show-timeout/hide-timeout when trigger is not hover', async () => {
    const wrapper = doMount(
      `
      <lp-dropdown trigger="click" :show-timeout="200" :hide-timeout="300">
        <span class="lp-dropdown-link">
          Dropdown List
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item>Item</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
      `,
      () => ({}),
    );
    const tooltipElement = wrapper.getComponent({
      name: 'LpTooltip',
    });
    expect(tooltipElement.vm.showAfter).toBe(0);
    expect(tooltipElement.vm.hideAfter).toBe(0);
  });

  describe('accessibility', () => {
    test('Custom span trigger has proper attributes', async () => {
      const wrapper = doMount(
        `
        <lp-dropdown>
          <span class="lp-dropdown-link" data-test-ref="trigger">
            Dropdown List
          </span>
          <template #dropdown>
            <lp-dropdown-menu ref="menu">
              <lp-dropdown-item>Item</lp-dropdown-item>
            </lp-dropdown-menu>
          </template>
        </lp-dropdown>
        `,
        () => ({}),
      );
      await nextTick();
      const trigger = wrapper.find('[data-test-ref="trigger"]');
      const menu = wrapper.findComponent({ ref: 'menu' });
      expect(trigger.attributes().role).toBe('button');
      expect(trigger.attributes().tabindex).toBe('0');
      expect(trigger.attributes()['aria-haspopup']).toBe('menu');
      expect(trigger.attributes().id).toBe(
        menu.attributes()['aria-labelledby'],
      );
      expect(trigger.attributes()['aria-controls']).toBe(
        menu.attributes().id,
      );
    });

    test('LpButton trigger has proper attributes', async () => {
      const wrapper = doMount(
        `
        <lp-dropdown>
          <lp-button ref="trigger">
            Dropdown List
          </lp-button>
          <template #dropdown>
            <lp-dropdown-menu ref="menu">
              <lp-dropdown-item>Item</lp-dropdown-item>
            </lp-dropdown-menu>
          </template>
        </lp-dropdown>
        `,
        () => ({}),
      );
      await nextTick();
      const trigger = wrapper.findComponent({ ref: 'trigger' });
      const menu = wrapper.findComponent({ ref: 'menu' });
      expect(trigger.attributes().role).toBe('button');
      expect(trigger.attributes().tabindex).toBe('0');
      expect(trigger.attributes()['aria-haspopup']).toBe('menu');
      expect(trigger.attributes().id).toBe(
        menu.attributes()['aria-labelledby'],
      );
      expect(trigger.attributes()['aria-controls']).toBe(
        menu.attributes().id,
      );
    });

    test('Split button trigger has proper attributes', async () => {
      const wrapper = doMount(
        `
        <lp-dropdown split-button>
          <template #dropdown>
            <lp-dropdown-menu ref="menu">
              <lp-dropdown-item>Item</lp-dropdown-item>
            </lp-dropdown-menu>
          </template>
        </lp-dropdown>
        `,
        () => ({}),
      );
      await nextTick();
      const trigger = wrapper.find('.lp-dropdown__caret-button');
      const menu = wrapper.findComponent({ ref: 'menu' });
      expect(trigger.attributes().role).toBe('button');
      expect(trigger.attributes().tabindex).toBe('0');
      expect(trigger.attributes()['aria-haspopup']).toBe('menu');
      expect(trigger.attributes().id).toBe(
        menu.attributes()['aria-labelledby'],
      );
      expect(trigger.attributes()['aria-controls']).toBe(
        menu.attributes().id,
      );
    });

    test('Menu items with "menu" role', async () => {
      const wrapper = doMount(
        `
        <lp-dropdown split-button>
          <template #dropdown>
            <lp-dropdown-menu ref="menu">
              <lp-dropdown-item ref="menu-item">Item</lp-dropdown-item>
            </lp-dropdown-menu>
          </template>
        </lp-dropdown>
        `,
        () => ({}),
      );
      const menu = wrapper.findComponent({ ref: 'menu' });
      const menuItem = menu.find('.lp-dropdown-menu__item');
      expect(menu.attributes().role).toBe('menu');
      expect(menuItem.attributes().role).toBe('menuitem');
    });

    test('Menu items with "navigation" role', async () => {
      const wrapper = doMount(
        `
        <lp-dropdown split-button role="navigation">
          <template #dropdown>
            <lp-dropdown-menu ref="menu">
              <lp-dropdown-item ref="menu-item">Item</lp-dropdown-item>
            </lp-dropdown-menu>
          </template>
        </lp-dropdown>
        `,
        () => ({}),
      );
      const menu = wrapper.findComponent({ ref: 'menu' });
      const menuItem = menu.find('.lp-dropdown-menu__item');
      expect(menu.attributes().role).toBe('navigation');
      expect(menuItem.attributes().role).toBe('link');
    });

    test('Menu items with "group" role', async () => {
      const wrapper = doMount(
        `
        <lp-dropdown split-button role="group">
          <template #dropdown>
            <lp-dropdown-menu ref="menu">
              <lp-dropdown-item ref="menu-item">Item</lp-dropdown-item>
            </lp-dropdown-menu>
          </template>
        </lp-dropdown>
        `,
        () => ({}),
      );
      const menu = wrapper.findComponent({ ref: 'menu' });
      const menuItem = menu.find('.lp-dropdown-menu__item');
      expect(menu.attributes().role).toBe('group');
      expect(menuItem.attributes().role).toBe('button');
    });
  });

  describe('teleported API', () => {
    test('should mount on popper container', async () => {
      expect(document.body.innerHTML).toBe('');
      doMount(
        `
        <lp-dropdown ref="b" placement="right">
          <span class="lp-dropdown-link" ref="a">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
          <template #dropdown>
            <lp-dropdown-menu>
              <lp-dropdown-item>Apple</lp-dropdown-item>
              <lp-dropdown-item>Orange</lp-dropdown-item>
              <lp-dropdown-item>Cherry</lp-dropdown-item>
              <lp-dropdown-item disabled>Peach</lp-dropdown-item>
              <lp-dropdown-item divided>Pear</lp-dropdown-item>
            </lp-dropdown-menu>
          </template>
        </lp-dropdown>`,
        () => ({}),
      );

      await nextTick();
      expect(
        document.body.querySelector(POPPER_CONTAINER_SELECTOR)!.innerHTML,
      ).not.toBe('');
    });

    test('should not mount on the popper container', async () => {
      expect(document.body.innerHTML).toBe('');
      doMount(
        `
        <lp-dropdown ref="b" placement="right" :teleported="false">
          <span class="lp-dropdown-link" ref="a">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
          <template #dropdown>
            <lp-dropdown-menu>
              <lp-dropdown-item>Apple</lp-dropdown-item>
              <lp-dropdown-item>Orange</lp-dropdown-item>
              <lp-dropdown-item>Cherry</lp-dropdown-item>
              <lp-dropdown-item disabled>Peach</lp-dropdown-item>
              <lp-dropdown-item divided>Pear</lp-dropdown-item>
            </lp-dropdown-menu>
          </template>
        </lp-dropdown>`,
        () => ({}),
      );

      await nextTick();
      expect(
        document.body.querySelector(POPPER_CONTAINER_SELECTOR)!.innerHTML,
      ).toBe('');
    });
  });
});
