import { defineComponent, renderSlot, watch } from 'vue';
import { buildProps, definePropType } from '@lemon-peel/utils';
import { provideGlobalConfig, useSizeProp } from '@lemon-peel/hooks';

import type { ExtractPropTypes } from 'vue';
import type { ExperimentalFeatures } from '@lemon-peel/tokens';
import type { Language } from '@lemon-peel/locale';
import type { ButtonConfigContext } from '@lemon-peel/components/button';
import type { MessageConfigContext } from '@lemon-peel/components/message';

export const messageConfig: MessageConfigContext = {};

export const configProviderProps = buildProps({
  // Controlling if the users want a11y features.
  a11y: {
    type: Boolean,
    default: true,
  },

  locale: {
    type: definePropType<Language>(Object),
  },

  size: useSizeProp,

  button: {
    type: definePropType<ButtonConfigContext>(Object),
  },

  experimentalFeatures: {
    type: definePropType<ExperimentalFeatures>(Object),
  },

  // Controls if we should handle keyboard navigation
  keyboardNavigation: {
    type: Boolean,
    default: true,
  },

  message: {
    type: definePropType<MessageConfigContext>(Object),
  },

  zIndex: Number,

  namespace: {
    type: String,
    default: 'el',
  },
} as const);
export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>;

const ConfigProvider = defineComponent({
  name: 'LpConfigProvider',
  props: configProviderProps,

  setup(props, { slots }) {
    watch(
      () => props.message,
      value => {
        Object.assign(messageConfig, value ?? {});
      },
      { immediate: true, deep: true },
    );
    const config = provideGlobalConfig(props);
    return () => renderSlot(slots, 'default', { config: config?.value });
  },
});
export type ConfigProviderInstance = InstanceType<typeof ConfigProvider>;

export default ConfigProvider;
