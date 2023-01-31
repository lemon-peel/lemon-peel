import { computed, getCurrentInstance, onMounted, watch } from 'vue';
import { isFunction } from '@vue/shared';
import { isClient } from '@vueuse/core';
import { buildProp, definePropType, isBoolean } from '@lemon-peel/utils';
import type { ExtractPropType } from '@lemon-peel/utils';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

import type { ComponentPublicInstance, ExtractPropTypes, Ref } from 'vue';

const modelProperty = buildProp({
  type: definePropType<boolean | null>(Boolean),
  default: null,
} as const);

const modelEvent = buildProp({
  type: definePropType<(value: boolean) => void>(Function),
} as const);

export type UseModelTogglePropsRaw<T extends string> = {
  [K in T]: typeof modelProperty
} & {
  [K in `onUpdate:${T}`]: typeof modelEvent
};

export type UseModelTogglePropsGeneric<T extends string> = {
  [K in T]: ExtractPropType<typeof modelProperty>
} & {
  [K in `onUpdate:${T}`]: ExtractPropType<typeof modelEvent>
};

export const createModelToggleComposable = <T extends string>(name: T) => {
  const updateEventKey = `update:${name}` as const;
  const updateEventKeyRaw = `onUpdate:${name}` as const;
  const useModelToggleEmits = [updateEventKey];

  const useModelToggleProperties = {
    [name]: modelProperty,
    [updateEventKeyRaw]: modelEvent,
  } as UseModelTogglePropsRaw<T>;

  const useModelToggle = ({
    indicator,
    toggleReason,
    shouldHideWhenRouteChanges,
    shouldProceed,
    onShow,
    onHide,
  }: ModelToggleParams) => {
    const instance = getCurrentInstance()!;
    const { emit } = instance;
    const properties = instance.props as UseModelTogglePropsGeneric<T> & {
      disabled: boolean;
    };
    const hasUpdateHandler = computed(() =>
      isFunction(properties[updateEventKeyRaw]),
    );
    // when it matches the default value we say this is absent
    // though this could be mistakenly passed from the user but we need to rule out that
    // condition
    const isModelBindingAbsent = computed(() => properties[name] === null);

    const doShow = (event?: Event) => {
      if (indicator.value === true) {
        return;
      }

      indicator.value = true;
      if (toggleReason) {
        toggleReason.value = event;
      }
      if (isFunction(onShow)) {
        onShow(event);
      }
    };

    const doHide = (event?: Event) => {
      if (indicator.value === false) {
        return;
      }

      indicator.value = false;
      if (toggleReason) {
        toggleReason.value = event;
      }
      if (isFunction(onHide)) {
        onHide(event);
      }
    };

    const show = (event?: Event) => {
      if (
        properties.disabled === true ||
        (isFunction(shouldProceed) && !shouldProceed())
      )
        return;

      const shouldEmit = hasUpdateHandler.value && isClient;

      if (shouldEmit) {
        emit(updateEventKey, true);
      }

      if (isModelBindingAbsent.value || !shouldEmit) {
        doShow(event);
      }
    };

    const hide = (event?: Event) => {
      if (properties.disabled === true || !isClient) return;

      const shouldEmit = hasUpdateHandler.value && isClient;

      if (shouldEmit) {
        emit(updateEventKey, false);
      }

      if (isModelBindingAbsent.value || !shouldEmit) {
        doHide(event);
      }
    };

    const onChange = (value: boolean) => {
      if (!isBoolean(value)) return;
      if (properties.disabled && value) {
        if (hasUpdateHandler.value) {
          emit(updateEventKey, false);
        }
      } else if (indicator.value !== value) {
        if (value) {
          doShow();
        } else {
          doHide();
        }
      }
    };

    const toggle = () => {
      if (indicator.value) {
        hide();
      } else {
        show();
      }
    };

    watch(() => properties[name], onChange);

    if (
      shouldHideWhenRouteChanges &&
      instance.appContext.config.globalProperties.$route !== undefined
    ) {
      watch(
        () => ({
          ...(
            instance.proxy as ComponentPublicInstance<{
              $route: RouteLocationNormalizedLoaded;
            }>
          ).$route,
        }),
        () => {
          if (shouldHideWhenRouteChanges.value && indicator.value) {
            hide();
          }
        },
      );
    }

    onMounted(() => {
      onChange(properties[name]);
    });

    return {
      hide,
      show,
      toggle,
      hasUpdateHandler,
    };
  };

  return {
    useModelToggle,
    useModelToggleProps: useModelToggleProperties,
    useModelToggleEmits,
  };
};

const { useModelToggle, useModelToggleProps, useModelToggleEmits } =
  createModelToggleComposable('modelValue');

export { useModelToggle, useModelToggleEmits, useModelToggleProps };

export type UseModelToggleProps = ExtractPropTypes<typeof useModelToggleProps>;

export type ModelToggleParams = {
  indicator: Ref<boolean>;
  toggleReason?: Ref<Event | undefined>;
  shouldHideWhenRouteChanges?: Ref<boolean>;
  shouldProceed?: () => boolean;
  onShow?: (event?: Event) => void;
  onHide?: (event?: Event) => void;
};
