import { mount } from '@vue/test-utils';
import { merge } from 'lodash';

const makeMount = <C extends Parameters<typeof mount>[0], O, E>(element: C, defaultOptions: O) => {
  return (props: (E | O) | (E & O) = {} as E) =>
    mount(element, merge({}, defaultOptions, props));
};

interface Options {
  data?: () => {
    [key: string]: unknown;
  };
  methods?: {
    [key: string]: (...args: unknown[]) => any;
  };
}

export const makeMountFunc = (
  defaultOptions: Parameters<typeof mount>[0],
) => {
  return (template: string, options: Options) => {
    return mount({
      ...merge({}, defaultOptions, options),
      template,
    });
  };
};

export default makeMount;
