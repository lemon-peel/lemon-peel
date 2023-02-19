import { isRef, onMounted, ref, unref, watchEffect } from 'vue';
import { isClient, unrefElement } from '@vueuse/core';
import { isNil } from 'lodash-es';
import { arrow as arrowCore, computePosition } from '@floating-ui/dom';
import { buildProps, keysOf } from '@lemon-peel/utils';

import type { Ref, ToRefs } from 'vue';
import type { ComputePositionReturn, Middleware, Placement, SideObject, Strategy, VirtualElement } from '@floating-ui/dom';

export const useFloatingProps = buildProps({} as const);

export type UseFloatingProps = ToRefs<{
  middleware: Array<Middleware>;
  placement: Placement;
  strategy: Strategy;
}>;

type ElementReference = Parameters<typeof unrefElement>['0'];

const unrefReference = (
  elementReference: ElementReference | Ref<VirtualElement | undefined>,
) => {
  if (!isClient) return;
  if (!elementReference) return elementReference;
  const unrefEle = unrefElement(elementReference as ElementReference);
  if (unrefEle) return unrefEle;
  return isRef(elementReference) ? unrefEle : (elementReference as VirtualElement);
};

export const getPositionDataWithUnit = <T extends Record<string, number>>(
  record: T | undefined,
  key: keyof T,
) => {
  const value = record?.[key];
  return isNil(value) ? '' : `${value}px`;
};

export const useFloating = ({
  middleware,
  placement,
  strategy,
}: UseFloatingProps) => {
  const referenceReference = ref<HTMLElement | VirtualElement>();
  const contentReference = ref<HTMLElement>();
  const x = ref<number>();
  const y = ref<number>();
  const middlewareData = ref<ComputePositionReturn['middlewareData']>({});

  const states = {
    x,
    y,
    placement,
    strategy,
    middlewareData,
  } as const;

  const update = async () => {
    if (!isClient) return;

    const referenceElement = unrefReference(referenceReference);
    const contentElement = unrefElement(contentReference);
    if (!referenceElement || !contentElement) return;

    const data = await computePosition(referenceElement, contentElement, {
      placement: unref(placement),
      strategy: unref(strategy),
      middleware: unref(middleware),
    });

    for (const key of keysOf(states)) {
      states[key].value = data[key];
    }
  };

  onMounted(() => {
    watchEffect(() => {
      update();
    });
  });

  return {
    ...states,
    update,
    referenceRef: referenceReference,
    contentRef: contentReference,
  };
};

export type ArrowMiddlewareProps = {
  arrowRef: Ref<HTMLElement | null | undefined>;
  padding?: number | SideObject;
};

export const arrowMiddleware = ({
  arrowRef,
  padding,
}: ArrowMiddlewareProps): Middleware => {
  return {
    name: 'arrow',
    options: {
      element: arrowRef,
      padding,
    },

    fn(arguments_) {
      const arrowElement = unref(arrowRef);
      if (!arrowElement) return {};

      return arrowCore({
        element: arrowElement,
        padding,
      }).fn(arguments_);
    },
  };
};
