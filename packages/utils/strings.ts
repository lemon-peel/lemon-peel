import { capitalize as toCapitalize } from 'vue';
export {
  camelize,
  hyphenate,
  hyphenate as kebabCase, // alias
} from '@vue/shared';

/**
 * fork from {@link https://github.com/sindresorhus/escape-string-regexp}
 */
export function escapeStringRegexp(str = '') {
  return str.replaceAll(/[$()*+.?[\\\]^{|}]/g, '\\$&').replaceAll('-', '\\x2d');
}

// NOTE: improve capitalize types. Restore previous code after the [PR](https://github.com/vuejs/core/pull/6212) merge
export const capitalize = <T extends string>(string_: T) =>
  toCapitalize(string_) as Capitalize<T>;
