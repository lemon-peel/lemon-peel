import type { ConfigProviderProps } from '@lemon-peel/components/config-provider';
import type { InjectionKey, Ref } from 'vue';

export type ConfigProviderContext = Partial<ConfigProviderProps>;

export const configProviderContextKey: InjectionKey<
Ref<ConfigProviderContext>
> = Symbol();
