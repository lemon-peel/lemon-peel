
import { nextTick, ref } from 'vue';
import { afterEach, describe, expect, test } from 'vitest';
import makeMount from '@lemon-peel/test-utils/make-mount';
import { rAF } from '@lemon-peel/test-utils/tick';
import Popover from '../src/Popover.vue';
import PopoverDirective, { VPopover } from '../src/directive';

const AXIOM = 'Rem is the best girl';

const Comp = {
  template: `
  <lp-popover ref="popoverRef" title="title" :content="content" virtual-triggering trigger="click" />
  <div v-popover="popoverRef" id="reference-node">
    trigger
  </div>
  `,
  components: {
    [Popover.name]: Popover,
  },
  setup() {
    return {
      popoverRef: ref(null),
      content: AXIOM,
    };
  },
};

const mount = makeMount(Comp, {
  props: {},
  global: {
    directives: {
      [VPopover]: PopoverDirective,
    },
  },
});

describe('v-popover', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });
  test('should render correctly', async () => {
    const wrapper = mount();
    await nextTick();

    expect(document.body.querySelector('.lp-popover').innerHTML).toContain(
      AXIOM,
    );
    wrapper.unmount();
  });

  test('should show popover when reference is mounted', async () => {
    const wrapper = mount();
    await nextTick();
    const refNode = '#reference-node';
    expect(wrapper.find(refNode).exists()).toBe(true);
    expect(
      document.body.querySelector('.lp-popover').getAttribute('style'),
    ).toContain('display: none');
    await wrapper.find(refNode).trigger('click', {
      button: 0,
    });
    await nextTick();
    await rAF();
    expect(
      document.body.querySelector('.lp-popover').getAttribute('style'),
    ).not.toContain('display: none');
    wrapper.unmount();
  });
});
