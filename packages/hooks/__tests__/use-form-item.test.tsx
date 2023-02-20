import { defineComponent, provide } from 'vue';
import { NOOP } from '@vue/shared';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { ElButton } from '@lemon-peel/components';
import {
  buttonGroupContextKey,
  formContextKey,
  formItemContextKey,
} from '@lemon-peel/tokens';

import type { FormContext, FormItemContext } from '@lemon-peel/tokens';

const AXIOM = 'Rem is the best girl';

const mountComponent = (setup = NOOP, options = {}) =>
  mount(
    defineComponent({
      setup,
      render() {
        return <ElButton {...this.$attrs}>{AXIOM}</ElButton>;
      },
    }),
    options,
  );

describe('use-form-item', () => {
  it('should return local value', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.lp-button').exists()).toBe(true);
  });

  it('should return props.size instead of injected.size', () => {
    const propSize = 'small';
    const wrapper = mountComponent(
      () => {
        provide(formItemContextKey, {
          size: 'large',
        } as FormItemContext);
      },
      {
        props: { size: propSize },
      },
    );

    expect(wrapper.find(`.lp-button--${propSize}`).exists()).toBe(true);
  });

  it('should return fallback.size instead inject.size', () => {
    const fallbackSize = 'small';
    const wrapper = mountComponent(() => {
      provide(buttonGroupContextKey, {
        size: fallbackSize,
      });

      provide(formItemContextKey, {
        size: 'large',
      } as FormItemContext);
    });

    expect(wrapper.find(`.lp-button--${fallbackSize}`).exists()).toBe(true);
  });

  it('should return formItem.size instead form.size', () => {
    const itemSize = 'small';
    const wrapper = mountComponent(() => {
      provide(formItemContextKey, {
        size: itemSize,
      } as FormItemContext);

      provide(formContextKey, {
        size: 'large',
      } as FormContext);
    });

    expect(wrapper.find(`.lp-button--${itemSize}`).exists()).toBe(true);
  });
});
