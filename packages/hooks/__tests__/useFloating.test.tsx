import { computed, defineComponent, nextTick, reactive, ref, watch } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { rAF } from '@lemon-peel/test-utils/tick';
import { arrowMiddleware, useFloating } from '../src/useFloating';

import type { CSSProperties, Ref } from 'vue';
import type { Middleware, Placement, Strategy } from '@floating-ui/dom';

describe('useFloating', () => {
  const createComponent = (arrow = false) => {
    return mount(defineComponent({
      setup() {
        const placement = ref<Placement>('bottom');
        const strategy = ref<Strategy>('fixed');
        const arrowRef: Ref<HTMLElement> = ref(null as any);
        const middleware = ref<Array<Middleware>>(
          arrow
            ? [arrowMiddleware({ arrowRef })]
            : [],
        );

        const { referenceRef, contentRef, x, y, update, middlewareData } =
          useFloating({
            placement,
            strategy,
            middleware,
          });

        const contentStyle = computed<CSSProperties>(() => {
          return reactive({ position: strategy, x, y });
        });

        watch(arrowRef, () => update());

        return {
          arrowRef,
          contentRef,
          contentStyle,
          referenceRef,
          middlewareData,
        };
      },
      render() {
        const { contentStyle } = this;
        return (
          <div>
            <button ref="referenceRef">My button</button>
            <div ref="contentRef" style={contentStyle}>
              My tooltip
              <div ref="arrowRef" />
            </div>
          </div>
        );
      },
    }), { attachTo: document.body });
  };

  let wrapper: ReturnType<typeof createComponent>;

  it('should render without arrow correctly', async () => {
    wrapper = createComponent();
    await rAF();
    await nextTick();

    expect(wrapper.vm.referenceRef).toBeInstanceOf(Element);
    expect(wrapper.vm.contentRef).toBeInstanceOf(Element);
    expect(wrapper.vm.middlewareData.arrow).toBeUndefined();
  });

  it('should render with arrow correctly', async () => {
    wrapper = createComponent(true);
    await rAF();
    await nextTick();

    expect(wrapper.vm.referenceRef).toBeInstanceOf(Element);
    expect(wrapper.vm.contentRef).toBeInstanceOf(Element);
    expect(wrapper.vm.middlewareData.arrow).toBeDefined();
  });
});
