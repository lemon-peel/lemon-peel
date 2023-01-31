import { nextTick } from 'vue';
import { isString } from '@vue/shared';
import { isClient } from '@vueuse/core';
import { addClass, getStyle, removeClass } from '@lemon-peel/utils';
import { useNamespace, useZIndex } from '@lemon-peel/hooks';

import type { CSSProperties } from 'vue';
import type { LoadingInstance } from './loading';
import type { LoadingOptionsResolved } from '../index';
import type { LoadingOptions } from './types';

import { createLoadingComponent } from './loading';

let fullscreenInstance: LoadingInstance | undefined;

const resolveOptions = (options: LoadingOptions): LoadingOptionsResolved => {
  const target: HTMLElement = isString(options.target)
    ? document.querySelector<HTMLElement>(options.target) ?? document.body
    : options.target || document.body;

  return {
    parent: target === document.body || options.body ? document.body : target,
    background: options.background || '',
    svg: options.svg || '',
    svgViewBox: options.svgViewBox || '',
    spinner: options.spinner || false,
    text: options.text || '',
    fullscreen: target === document.body && (options.fullscreen ?? true),
    lock: options.lock ?? false,
    customClass: options.customClass || '',
    visible: options.visible ?? true,
    target,
  };
};

const addStyle = async (
  options: LoadingOptionsResolved,
  parent: HTMLElement,
  instance: LoadingInstance,
) => {
  const { nextZIndex } = useZIndex();
  const maskStyle: CSSProperties = {};
  if (options.fullscreen) {
    instance.originalPosition.value = getStyle(document.body, 'position');
    instance.originalOverflow.value = getStyle(document.body, 'overflow');
    maskStyle.zIndex = nextZIndex();
  } else if (options.parent === document.body) {
    instance.originalPosition.value = getStyle(document.body, 'position');
    /**
     * await dom render when visible is true in init,
     * because some component's height maybe 0.
     * e.g. el-table.
     */
    await nextTick();
    for (const property of (['top', 'left'] as const)) {
      const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
      maskStyle[property] = `${
        (options.target as HTMLElement).getBoundingClientRect()[property] +
        document.body[scroll] +
        document.documentElement[scroll] -
        Number.parseInt(getStyle(document.body, `margin-${property}`), 10)
      }px`;
    }

    for (const property of (['height', 'width'] as const)) {
      maskStyle[property] = `${
        (options.target as HTMLElement).getBoundingClientRect()[property]
      }px`;
    }
  } else {
    instance.originalPosition.value = getStyle(parent, 'position');
  }

  Object.assign(instance.$el.style, maskStyle);
};

const addClassList = (
  options: LoadingOptions,
  parent: HTMLElement,
  instance: LoadingInstance,
) => {
  const ns = useNamespace('loading');

  if (
    !['absolute', 'fixed', 'sticky'].includes(instance.originalPosition.value)
  ) {
    addClass(parent, ns.bm('parent', 'relative'));
  } else {
    removeClass(parent, ns.bm('parent', 'relative'));
  }
  if (options.fullscreen && options.lock) {
    addClass(parent, ns.bm('parent', 'hidden'));
  } else {
    removeClass(parent, ns.bm('parent', 'hidden'));
  }
};

export const Loading = function (options: LoadingOptions = {}): LoadingInstance {
  if (!isClient) return undefined as any;

  const resolved = resolveOptions(options);

  if (resolved.fullscreen && fullscreenInstance) {
    return fullscreenInstance;
  }

  const instance = createLoadingComponent({
    ...resolved,
    closed: () => {
      resolved.closed?.();
      if (resolved.fullscreen) fullscreenInstance = undefined;
    },
  });

  addStyle(resolved, resolved.parent, instance);
  addClassList(resolved, resolved.parent, instance);

  resolved.parent.vLoadingAddClassList = () =>
    addClassList(resolved, resolved.parent, instance);

  /**
   * add loading-number to parent.
   * because if a fullscreen loading is triggered when somewhere
   * a v-loading.body was triggered before and it's parent is
   * document.body which with a margin , the fullscreen loading's
   * destroySelf function will remove 'el-loading-parent--relative',
   * and then the position of v-loading.body will be error.
   */
  let loadingNumber: string | null =
    resolved.parent.getAttribute('loading-number');
  loadingNumber = !loadingNumber ? '1' : `${Number.parseInt(loadingNumber) + 1}`;
  resolved.parent.setAttribute('loading-number', loadingNumber);

  resolved.parent.append(instance.$el);

  // after instance render, then modify visible to trigger transition
  nextTick(() => (instance.visible.value = resolved.visible));

  if (resolved.fullscreen) {
    fullscreenInstance = instance;
  }
  return instance;
};