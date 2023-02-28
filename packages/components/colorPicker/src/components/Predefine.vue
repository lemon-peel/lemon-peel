<template>
  <div :class="ns.b()">
    <div :class="ns.e('colors')">
      <div
        v-for="(item, index) in rgbaColors"
        :key="colors[index]"
        :class="[
          ns.e('color-selector'),
          ns.is('alpha', item._alpha < 100),
          { selected: item.selected },
        ]"
        @click="handleSelect(index)"
      >
        <div :style="{ backgroundColor: item.value }" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch, watchEffect } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { colorPickerContextKey } from '../colorPicker';
import Color from '../utils/color';

import type { PropType, Ref } from 'vue';

export default defineComponent({
  props: {
    colors: {
      type: Array as PropType<string[]>,
      required: true,
    },
    color: {
      type: Object as PropType<Color>,
      required: true,
    },
  },
  setup(props) {
    const ns = useNamespace('color-predefine');
    const { currentColor } = inject(colorPickerContextKey)!;

    function parseColors(colors: string[], color: Color) {
      return colors.map(value => {
        const c = new Color();
        c.enableAlpha = true;
        c.format = 'rgba';
        c.fromString(value);
        c.selected = c.value === color.value;
        return c;
      });
    }

    const rgbaColors = ref<Color[]>(parseColors(props.colors, props.color));

    watch(
      () => currentColor.value,
      value => {
        const color = new Color();
        color.fromString(value);

        for (const item of rgbaColors.value) {
          item.selected = color.compare(item as Color);
        }
      },
    );

    watchEffect(() => {
      rgbaColors.value = parseColors(props.colors, props.color);
    });

    function handleSelect(index: number) {
      props.color.fromString(props.colors[index]);
    }
    return {
      rgbaColors,
      handleSelect,
      ns,
    };
  },
});
</script>
