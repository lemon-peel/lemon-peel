import { useGlobalConfig } from '../useGlobalConfig';

export const defaultNamespace = 'lp';
const statePrefix = 'is-';

const namer = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string,
) => {
  let cls = `${namespace}-${block}`;
  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }
  return cls;
};

const is = (name: string, state = true) => {
  return name && state ? `${statePrefix}${name}` : '';
};

export const useNamespace = (block: string) => {
  const namespace = useGlobalConfig('namespace', defaultNamespace);
  const b = (blockSuffix = '') =>
    namer(namespace.value, block, blockSuffix, '', '');
  const e = (element?: string) =>
    element ? namer(namespace.value, block, '', element, '') : '';
  const m = (modifier?: string) =>
    modifier ? namer(namespace.value, block, '', '', modifier) : '';
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element
      ? namer(namespace.value, block, blockSuffix, element, '')
      : '';
  const em = (element?: string, modifier?: string) =>
    element && modifier
      ? namer(namespace.value, block, '', element, modifier)
      : '';
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier
      ? namer(namespace.value, block, blockSuffix, '', modifier)
      : '';
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? namer(namespace.value, block, blockSuffix, element, modifier)
      : '';

  // for css var
  // --lp-xxx: value;
  const cssVariable = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key];
      }
    }
    return styles;
  };
  // with block
  const cssVariableBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key];
      }
    }
    return styles;
  };

  const cssVariableName = (name: string) => `--${namespace.value}-${name}`;
  const cssVariableBlockName = (name: string) =>
    `--${namespace.value}-${block}-${name}`;

  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    // css
    cssVar: cssVariable,
    cssVarName: cssVariableName,
    cssVarBlock: cssVariableBlock,
    cssVarBlockName: cssVariableBlockName,
  };
};

export type CssNamespace = ReturnType<typeof useNamespace>;
