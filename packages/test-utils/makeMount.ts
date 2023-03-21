import { mount } from '@vue/test-utils';
import { merge } from 'lodash-es';

import type { MountingOptions } from '@vue/test-utils';
import type { AllowedComponentProps, ComponentCustomProps, DefineComponent, ExtractDefaultPropTypes, ExtractPropTypes, VNodeProps } from 'vue';

type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps;

// TODO 待官方更新后使用官方的类型定义
export type ComponentMountingOptions<T> = T extends DefineComponent<
infer PropsOrPropOptions,
any,
infer D,
any,
any
>
  ? MountingOptions<
  Partial<ExtractDefaultPropTypes<PropsOrPropOptions>> &
  Omit<
  Readonly<ExtractPropTypes<PropsOrPropOptions>> & PublicProps,
  keyof ExtractDefaultPropTypes<PropsOrPropOptions>
  >,
  D
  > &
  Record<string, any>
  : MountingOptions<any>;


const makeMount = <C extends Parameters<typeof mount>[0], O, E>(element: C, defaultOptions: O) => {
  return (props: (E | O) | (E & O) = {} as E) =>
    mount(element as any, merge({}, defaultOptions, props));
};

export function makeMountFunc<T>(defaultOptions: T) {
  return (template: string, options: T) => {
    return mount({
      ...merge({}, defaultOptions, options),
      template,
    });
  };
}

export default makeMount;
