
export const defaultSize = 'default' as const;

export const componentSizes = [defaultSize, 'small', 'large'] as const;

export type ComponentSize = typeof componentSizes[number];

export enum ComponentSizeMap {
  large = 40,
  default = 32,
  small = 24,
}
