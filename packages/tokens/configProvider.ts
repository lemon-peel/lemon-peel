import type { ConfigProviderProps } from '@lemon-peel/components/configProvider';
import type { InjectionKey, Ref } from 'vue';

export type ConfigProviderContext = Partial<ConfigProviderProps>;

export const configProviderContextKey: InjectionKey<Ref<ConfigProviderContext>> = Symbol('configProviderContextKey');
