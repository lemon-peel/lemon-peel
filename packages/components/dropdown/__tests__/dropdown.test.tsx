
import { nextTick } from 'vue';
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { EVENT_CODE } from '@lemon-peel/constants';
import { rAF } from '@lemon-peel/test-utils/tick';
import { POPPER_CONTAINER_SELECTOR } from '@lemon-peel/hooks';

import LpButton from '@lemon-peel/components/button';
import LpScrollBar from '@lemon-peel/components/scrollbar';
import { LpTooltip } from '@lemon-peel/components/tooltip';
import { LpPopperContent } from '@lemon-peel/components/popper';

import Dropdown from '../src/Dropdown.vue';
import DropdownItem from '../src/DropdownItem.vue';
import DropdownMenu from '../src/DropdownMenu.vue';
import DropdownItemImpl from '../src/DropdownItemImpl.vue';

const MOUSE_ENTER_EVENT = 'mouseenter';
const MOUSE_LEAVE_EVENT = 'mouseleave';
const CONTEXTMENU = 'contextmenu';

describe('Dropdown', () => {
  let wrapper: VueWrapper<any>;

  afterEach(() => {
    wrapper?.unmount();
    document.body.innerHTML = '';
  });

  test('create', async () => {
    wrapper = mount(
      () => (<Dropdown v-slots={{
        dropdown: () => (<DropdownMenu>
          <DropdownItem>Apple</DropdownItem>
          <DropdownItem>Orange</DropdownItem>
          <DropdownItem>Cherry</DropdownItem>
          <DropdownItem disabled>Peach</DropdownItem>
          <DropdownItem divided>Pear</DropdownItem>
        </DropdownMenu>),
      }}>
        <span class="lp-dropdown-link">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
      </Dropdown>),
      { attachTo: 'body' },
    );

    await nextTick();
    const content = wrapper.findComponent(LpTooltip).vm;

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
    wrapper = mount(
      () => (<Dropdown v-slots={{
        dropdown: () => (<DropdownMenu>
          <DropdownItem command="a">Apple</DropdownItem>
          <DropdownItem command="b">Orange</DropdownItem>
          <DropdownItem command={{ name: 'CommandC' }}>Cherry</DropdownItem>
          <DropdownItem command="d">Peach</DropdownItem>
          <DropdownItem command="e">Pear</DropdownItem>
        </DropdownMenu>),
      }} onCommand={commandHandler} placement='right'>
        <span class="lp-dropdown-link">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
      </Dropdown>),
      { attachTo: 'body' },
    );

    await nextTick();

    const triggerElm = wrapper.find('.lp-tooltip__trigger');
    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    await nextTick();
    await wrapper.findAllComponents(DropdownItem).at(2)!
      .find('.lp-dropdown-menu__item').trigger('click');

    await nextTick();
    expect(commandHandler).toHaveBeenCalled();
  });

  test('trigger', async () => {
    wrapper = mount(
      () => (<Dropdown placement='right' trigger="click" v-slots={{
        dropdown: () => (<DropdownMenu>
          <DropdownItem command={'a'}>Apple</DropdownItem>
          <DropdownItem command={'b'}>Orange</DropdownItem>
          <DropdownItem command={{ name: 'CommandC' }}>Cherry</DropdownItem>
          <DropdownItem command={'d'}>Peach</DropdownItem>
          <DropdownItem command={'e'}>Pear</DropdownItem>
        </DropdownMenu>),
      }}>
        <span class="lp-dropdown-link">
          dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
        </span>
      </Dropdown>),
      { attachTo: 'body' },
    );

    await nextTick();
    const content = wrapper.findComponent(LpTooltip).vm;
    const triggerElm = wrapper.find('.lp-dropdown-link');
    expect(content.open).toBe(false);
    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    expect(content.open).toBe(false);

    await triggerElm.trigger('click', { button: 0 });
    await rAF();

    expect(content.open).toBe(true);
  });

  test('trigger contextmenu', async () => {
    wrapper = mount(
      () => (<Dropdown placement='right' trigger="contextmenu" v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem command={'a'}>Apple</DropdownItem>
            <DropdownItem command={'b'}>Orange</DropdownItem>
            <DropdownItem command={{ name: 'CommandC' }}>Cherry</DropdownItem>
            <DropdownItem command={'d'}>Peach</DropdownItem>
            <DropdownItem command={'e'}>Pear</DropdownItem>
          </DropdownMenu>),
      }}>
          <span class="lp-dropdown-link">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
        </Dropdown>),
      { attachTo: 'body' },
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
    wrapper = mount(
      () => (<Dropdown ref="dp" trigger="click" v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem command={'a'}>Apple</DropdownItem>
            <DropdownItem command={'b'}>Orange</DropdownItem>
            <DropdownItem command={'c'}>Cherry</DropdownItem>
            <DropdownItem command={'d'}>Peach</DropdownItem>
            <DropdownItem command={'e'}>Pear</DropdownItem>
          </DropdownMenu>),
      }} placement='right'>
          <span class="lp-dropdown-link">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
        </Dropdown>),
      { attachTo: 'body' },
    );

    await nextTick();

    const dropdown = wrapper.findComponent(Dropdown).vm;

    const content = wrapper.findComponent(LpTooltip).vm;
    expect(content.open).toBe(false);

    await dropdown.open();
    await rAF();

    expect(content.open).toBe(true);

    await dropdown.close();
    await rAF();

    expect(content.open).toBe(false);
  });

  test('split button', async () => {
    const handleClick = vi.fn();
    wrapper = mount(
      () => (<Dropdown split-button type="primary" placement="right" onClick={handleClick} v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem command={'a'}>Apple</DropdownItem>
            <DropdownItem command={'b'}>Orange</DropdownItem>
            <DropdownItem command={{ name: 'CommandC' }}>Cherry</DropdownItem>
            <DropdownItem command={'d'}>Peach</DropdownItem>
            <DropdownItem command={'e'}>Pear</DropdownItem>
          </DropdownMenu>),
      }}>
          dropdown
        </Dropdown>),
      { attachTo: 'body' },
    );

    await nextTick();
    const content = wrapper.findComponent(LpTooltip).vm;
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
    wrapper = mount(
      () => (<Dropdown placement='right' hide-on-click={false} v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem>Apple</DropdownItem>
            <DropdownItem>Orange</DropdownItem>
            <DropdownItem>Cherry</DropdownItem>
            <DropdownItem disabled>Peach</DropdownItem>
            <DropdownItem divided>Pear</DropdownItem>
          </DropdownMenu>),
      }}>
          <span class="lp-dropdown-link">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
        </Dropdown>),
      { attachTo: 'body' },
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
      .findAllComponents(DropdownItem)
      .at(2)!
      .findComponent(DropdownItemImpl)
      .trigger('click');

    vi.runAllTimers();
    expect(content.open).toBe(true);
    vi.useRealTimers();
  });

  test('triggerElm keydown', async () => {
    wrapper = mount(
      () => (<Dropdown placement='right' hide-on-click={false} v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem>Apple</DropdownItem>
            <DropdownItem>Orange</DropdownItem>
            <DropdownItem>Cherry</DropdownItem>
            <DropdownItem disabled>Peach</DropdownItem>
            <DropdownItem divided>Pear</DropdownItem>
          </DropdownMenu>),
      }}>
          <span class="lp-dropdown-link">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
        </Dropdown>),
      { attachTo: 'body' },
    );

    await nextTick();
    const content = wrapper.findComponent(LpTooltip).vm;
    const triggerElm = wrapper.find('.lp-tooltip__trigger');

    vi.useFakeTimers();
    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    vi.runAllTimers();
    await triggerElm.trigger('keydown', { code: EVENT_CODE.enter });
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
    wrapper = mount(
      () => (<Dropdown placement='right' hide-on-click={false} v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem>Apple</DropdownItem>
            <DropdownItem>Orange</DropdownItem>
            <DropdownItem>Cherry</DropdownItem>
            <DropdownItem disabled>Peach</DropdownItem>
            <DropdownItem divided>Pear</DropdownItem>
          </DropdownMenu>),
      }}>
          <span class="lp-dropdown-link">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
        </Dropdown>),
      { attachTo: 'body' },
    );

    await nextTick();
    const content = wrapper.findComponent(DropdownMenu);
    const triggerElm = wrapper.find('.lp-tooltip__trigger');

    await triggerElm.trigger(MOUSE_ENTER_EVENT);
    await rAF();

    await content.trigger('keydown', { code: EVENT_CODE.down });
    await rAF();

    const itemDiv = wrapper.findAllComponents(DropdownItem).at(0)!
      .findComponent(DropdownItemImpl)
      .find('.lp-dropdown-menu__item');

    expect(itemDiv.element.getAttribute('tabindex')).toBe('0');
  });

  test('max height', async () => {
    wrapper = mount(
      () => (<Dropdown max-height="60px" v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem>Apple</DropdownItem>
            <DropdownItem>Orange</DropdownItem>
            <DropdownItem>Cherry</DropdownItem>
            <DropdownItem disabled>Peach</DropdownItem>
            <DropdownItem divided>Pear</DropdownItem>
          </DropdownMenu>),
      }}>
          <span class="lp-dropdown-link">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
        </Dropdown>),
      { attachTo: 'body' },
    );

    await nextTick();
    const scrollbar = wrapper.findComponent(LpScrollBar);

    expect(scrollbar.find('.lp-scrollbar__wrap').attributes('style'))
      .toContain('max-height: 60px;');
  });

  test('tooltip debounce', async () => {
    wrapper = mount(
      () => (<Dropdown v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem>Apple</DropdownItem>
            <DropdownItem>Orange</DropdownItem>
            <DropdownItem>Cherry</DropdownItem>
            <DropdownItem>Peach</DropdownItem>
            <DropdownItem>Pear</DropdownItem>
          </DropdownMenu>),
      }}>
          <span class="lp-dropdown-link">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
        </Dropdown>),
      { attachTo: 'body' },
    );

    const content = wrapper.findComponent(LpTooltip).vm;
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
    wrapper = mount(
      () => (<Dropdown max-height="60px" popper-class="custom-popper-class" v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem>Apple</DropdownItem>
            <DropdownItem>Orange</DropdownItem>
            <DropdownItem>Cherry</DropdownItem>
            <DropdownItem disabled>Peach</DropdownItem>
            <DropdownItem divided>Pear</DropdownItem>
          </DropdownMenu>),
      }}>
          <span class="lp-dropdown-link">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
        </Dropdown>),
      { attachTo: 'body' },
    );

    const popperElement = wrapper.findComponent(LpPopperContent).element;
    expect(popperElement.classList.contains('custom-popper-class')).toBe(true);
  });

  test('custom attributes for dropdown items', async () => {
    wrapper = mount(
      () => (<Dropdown v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem data-custom-attribute="hello">Item</DropdownItem>
          </DropdownMenu>),
      }}>
          <span class="lp-dropdown-link">
            Custom Attributes
          </span>
        </Dropdown>),
      { attachTo: 'body' },
    );

    await nextTick();

    expect((wrapper
      .findComponent(DropdownItemImpl)
      .find('.lp-dropdown-menu__item')
      .element as HTMLElement).dataset.customAttribute,
    ).toBe('hello');
  });

  test('disable normal dropdown', async () => {
    wrapper = mount(
      () => (<Dropdown disabled v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem data-custom-attribute="hello">Item</DropdownItem>
          </DropdownMenu>),
      }}>
          <span class="lp-dropdown-link">
            Dropdown List
          </span>
        </Dropdown>),
      { attachTo: 'body' },
    );

    await nextTick();
    expect(wrapper.findComponent(Dropdown).classes())
      .toContain('is-disabled');
  });

  test('disable dropdown with split button', async () => {
    wrapper = mount(
      () => (<Dropdown disabled split-button v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem data-custom-attribute="hello">Item</DropdownItem>
          </DropdownMenu>),
      }}>
          <span class="lp-dropdown-link">
            Dropdown List
          </span>
        </Dropdown>),
      { attachTo: 'body' },
    );

    await nextTick();

    const btns = wrapper.findAllComponents(LpButton);
    expect(btns.at(0)!.classes()).toContain('is-disabled');
    expect(btns.at(1)!.classes()).toContain('is-disabled');
  });

  test('set show-timeout/hide-timeout when trigger is hover', async () => {
    wrapper = mount(
      () => (<Dropdown trigger="hover" show-timeout={200} hide-timeout={300} v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem>Item</DropdownItem>
          </DropdownMenu>),
      }}>
          <span class="lp-dropdown-link">
            Dropdown List
          </span>
        </Dropdown>),
      { attachTo: 'body' },
    );

    const tooltipElement = wrapper.getComponent(LpTooltip);
    expect(tooltipElement.vm.showAfter).toBe(200);
    expect(tooltipElement.vm.hideAfter).toBe(300);
  });

  test('ignore show-timeout/hide-timeout when trigger is not hover', async () => {
    wrapper = mount(
      () => (<Dropdown trigger="click" show-timeout={200} hide-timeout={300} v-slots={{
        dropdown: () => (<DropdownMenu>
            <DropdownItem>Item</DropdownItem>
          </DropdownMenu>),
      }}>
          <span class="lp-dropdown-link">Dropdown List</span>
        </Dropdown>),
      { attachTo: 'body' },
    );

    const tooltipElement = wrapper.getComponent(LpTooltip);
    expect(tooltipElement.vm.showAfter).toBe(0);
    expect(tooltipElement.vm.hideAfter).toBe(0);
  });

  describe('accessibility', () => {
    test('Custom span trigger has proper attributes', async () => {
      wrapper = mount(
        () => (<Dropdown v-slots={{
          dropdown: () => (<DropdownMenu ref="menu">
            <DropdownItem>Item</DropdownItem>
          </DropdownMenu>),
        }}>
          <span class="lp-dropdown-link" data-test-ref="trigger">
            Dropdown List
          </span>
          </Dropdown>),
        { attachTo: 'body' },
      );

      await nextTick();
      const trigger = wrapper.find('[data-test-ref="trigger"]');
      const menu = wrapper.findComponent(DropdownMenu);
      expect(trigger.attributes().role).toBe('button');
      expect(trigger.attributes().tabindex).toBe('0');
      expect(trigger.attributes()['aria-haspopup']).toBe('menu');
      expect(trigger.attributes().id)
        .toBe(menu.attributes()['aria-labelledby']);
      expect(trigger.attributes()['aria-controls'])
        .toBe(menu.attributes().id);
    });

    test('LpButton trigger has proper attributes', async () => {
      wrapper = mount(
        () => (<Dropdown v-slots={{
          dropdown: () => (<DropdownMenu>
            <DropdownItem>Item</DropdownItem>
          </DropdownMenu>),
        }}>
          <LpButton ref="trigger">
            Dropdown List
          </LpButton>
          </Dropdown>),
        { attachTo: 'body' },
      );

      await nextTick();
      const trigger = wrapper.findComponent(LpButton);
      const menu = wrapper.findComponent(DropdownMenu);

      expect(trigger.attributes().role).toBe('button');
      expect(trigger.attributes().tabindex).toBe('0');
      expect(trigger.attributes()['aria-haspopup']).toBe('menu');
      expect(trigger.attributes().id)
        .toBe(menu.attributes()['aria-labelledby']);
      expect(trigger.attributes()['aria-controls'])
        .toBe(menu.attributes().id);
    });

    test('Split button trigger has proper attributes', async () => {
      wrapper = mount(
        () => (<Dropdown split-button v-slots={{
          dropdown: () => (<DropdownMenu>
            <DropdownItem>Item</DropdownItem>
          </DropdownMenu>),
        }}>
          </Dropdown>),
        { attachTo: 'body' },
      );

      await nextTick();
      const trigger = wrapper.find('.lp-dropdown__caret-button');
      const menu = wrapper.findComponent(DropdownMenu);

      expect(trigger.attributes().role).toBe('button');
      expect(trigger.attributes().tabindex).toBe('0');
      expect(trigger.attributes()['aria-haspopup']).toBe('menu');
      expect(trigger.attributes().id)
        .toBe(menu.attributes()['aria-labelledby']);
      expect(trigger.attributes()['aria-controls'])
        .toBe(menu.attributes().id);
    });

    test('Menu items with "menu" role', async () => {
      wrapper = mount(
        () => (<Dropdown split-button v-slots={{
          dropdown: () => (<DropdownMenu>
            <DropdownItem ref="menu-item">Item</DropdownItem>
          </DropdownMenu>),
        }}>
          </Dropdown>),
        { attachTo: 'body' },
      );

      const menu = wrapper.findComponent(DropdownMenu);
      const menuItem = menu.find('.lp-dropdown-menu__item');

      expect(menu.attributes().role).toBe('menu');
      expect(menuItem.attributes().role).toBe('menuitem');
    });

    test('Menu items with "navigation" role', async () => {
      const wrapper = mount(
        () => (<Dropdown split-button role="navigation" v-slots={{
          dropdown: () => (<DropdownMenu>
            <DropdownItem>Item</DropdownItem>
          </DropdownMenu>),
        }}>
          </Dropdown>),
        { attachTo: 'body' },
      );

      const menu = wrapper.findComponent(DropdownMenu);
      const menuItem = menu.find('.lp-dropdown-menu__item');

      expect(menu.attributes().role).toBe('navigation');
      expect(menuItem.attributes().role).toBe('link');
    });

    test('Menu items with "group" role', async () => {
      const wrapper = mount(
        () => (<Dropdown split-button role="group" v-slots={{
          dropdown: () => (<DropdownMenu>
            <DropdownItem>Item</DropdownItem>
          </DropdownMenu>),
        }}>
          </Dropdown>),
        { attachTo: 'body' },
      );
      const menu = wrapper.findComponent(DropdownMenu);
      const menuItem = menu.find('.lp-dropdown-menu__item');
      expect(menu.attributes().role).toBe('group');
      expect(menuItem.attributes().role).toBe('button');
    });
  });

  describe('teleported API', () => {
    test('should mount on popper container', async () => {
      expect(document.body.innerHTML).toBe('');
      mount(
        () => (<Dropdown placement="right" v-slots={{
          dropdown: () => (<DropdownMenu>
            <DropdownItem>Apple</DropdownItem>
            <DropdownItem>Orange</DropdownItem>
            <DropdownItem>Cherry</DropdownItem>
            <DropdownItem disabled>Peach</DropdownItem>
            <DropdownItem divided>Pear</DropdownItem>
          </DropdownMenu>),
        }}>
          <span class="lp-dropdown-link">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
        </Dropdown>),
        { attachTo: 'body' },
      );

      await nextTick();
      expect(document.body.querySelector(POPPER_CONTAINER_SELECTOR)!.innerHTML)
        .not.toBe('');
    });

    test('should not mount on the popper container', async () => {
      expect(document.body.innerHTML).toBe('');
      mount(
        () => (<Dropdown placement="right" teleported={false} v-slots={{
          dropdown: () => (<DropdownMenu>
            <DropdownItem>Apple</DropdownItem>
            <DropdownItem>Orange</DropdownItem>
            <DropdownItem>Cherry</DropdownItem>
            <DropdownItem disabled>Peach</DropdownItem>
            <DropdownItem divided>Pear</DropdownItem>
          </DropdownMenu>),
        }}>
          <span class="lp-dropdown-link">
            dropdown<i class="lp-icon-arrow-down lp-icon--right"></i>
          </span>
        </Dropdown>),
        { attachTo: 'body' },
      );

      await nextTick();
      expect(document.body.querySelector(POPPER_CONTAINER_SELECTOR)!.innerHTML)
        .toBe('');
    });
  });
});
