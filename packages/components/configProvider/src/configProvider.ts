import { defineComponent, renderSlot, watch } from 'vue';
import { buildProps } from '@lemon-peel/utils';
import { provideGlobalConfig, useSizeProp } from '@lemon-peel/hooks/src';

import type { ExtractPropTypes, PropType } from 'vue';
import type { ExperimentalFeatures } from '@lemon-peel/tokens';
import type { Language } from '@lemon-peel/locale';
import type { ButtonConfigContext } from '@lemon-peel/components/button';
import type { MessageConfigContext } from '@lemon-peel/components/message';

export const messageConfig: MessageConfigContext = {};

export const configProviderProps = buildProps({
  // Controlling if the users want a11y features.
  a11y: { type: Boolean, default: true },
  locale: { type: Object as PropType<Language> },
  size: useSizeProp,
  button: { type: Object as PropType<ButtonConfigContext> },
  experimentalFeatures: { type: Object as PropType<ExperimentalFeatures> },

  // Controls if we should handle keyboard navigation
  keyboardNavigation: { type: Boolean, default: true },
  message: { type: Object as PropType<MessageConfigContext> },
  zIndex: Number,
  namespace: { type: String, default: 'lp' },
});

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
