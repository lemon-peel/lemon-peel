import { mount } from '@vue/test-utils';
import { merge } from 'lodash-es';

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
