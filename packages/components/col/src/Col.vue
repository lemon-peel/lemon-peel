<template>
  <component :is="tag" :class="[ns.b(), classes]" :style="style">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { isNumber, isObject } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks';
import { rowContextKey } from '@lemon-peel/tokens';

import { colProps } from './col';

import type { CSSProperties } from 'vue';

defineOptions({ name: 'LpCol' });

const props = defineProps(colProps);

const { gutter } = inject(rowContextKey, { gutter: computed(() => 0) });
const ns = useNamespace('col');

const style = computed(() => {
  const styles: CSSProperties = {};
  if (gutter.value) {
    styles.paddingLeft = styles.paddingRight = `${gutter.value / 2}px`;
  }
  return styles;
});

const classes = computed(() => {
  const list: string[] = [];
  const pos = ['span', 'offset', 'pull', 'push'] as const;

  for (const property of pos) {
    const size = props[property];
    if (isNumber(size)) {
      if (property === 'span') list.push(ns.b(`${props[property]}`));
      else if (size > 0) list.push(ns.b(`${property}-${props[property]}`));
    }
  }

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
  for (const size of sizes) {
    if (isNumber(props[size])) {
      list.push(ns.b(`${size}-${props[size]}`));
    } else if (isObject(props[size])) {
      for (const [property, sizeProperty] of Object.entries(props[size])) {
        list.push(
          property !== 'span'
            ? ns.b(`${size}-${property}-${sizeProperty}`)
            : ns.b(`${size}-${sizeProperty}`),
        );
      }
    }
  }

  // this is for the fix
  if (gutter.value) {
    list.push(ns.is('guttered'));
  }
  return list;
});
</script>
