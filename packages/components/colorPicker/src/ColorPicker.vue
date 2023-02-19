<template>
  <lp-tooltip
    ref="popper"
    :visible="showPicker"
    :show-arrow="false"
    :fallback-placements="['bottom', 'top', 'right', 'left']"
    :offset="0"
    :gpu-acceleration="false"
    :popper-class="[ns.be('picker', 'panel'), ns.b('dropdown'), popperClass]"
    :stop-popper-mouse-event="false"
    effect="light"
    trigger="click"
    :transition="`${ns.namespace.value}-zoom-in-top`"
    persistent
  >
    <template #content>
      <div v-click-outside="hide">
        <div :class="ns.be('dropdown', 'main-wrapper')">
          <hue-slider ref="hue" class="hue-slider" :color="color" vertical />
          <sv-panel ref="svPanel" :color="color" />
        </div>
        <alpha-slider v-if="showAlpha" ref="alpha" :color="color" />
        <predefine
          v-if="predefine"
          ref="predefine"
          :color="color"
          :colors="predefine"
        />
        <div :class="ns.be('dropdown', 'btns')">
          <span :class="ns.be('dropdown', 'value')">
            <lp-input
              v-model="customInput"
              :validate-event="false"
              size="small"
              @keyup.enter="handleConfirm"
              @blur="handleConfirm"
            />
          </span>
          <lp-button
            :class="ns.be('dropdown', 'link-btn')"
            text
            size="small"
            @click="clear"
          >
            {{ t('el.colorpicker.clear') }}
          </lp-button>
          <lp-button
            plain
            size="small"
            :class="ns.be('dropdown', 'btn')"
            @click="confirmValue"
          >
            {{ t('el.colorpicker.confirm') }}
          </lp-button>
        </div>
      </div>
    </template>
    <template #default>
      <div
        :id="buttonId"
        :class="[
          ns.b('picker'),
          ns.is('disabled', colorDisabled),
          ns.bm('picker', colorSize),
        ]"
        role="button"
        :aria-label="buttonAriaLabel"
        :aria-labelledby="buttonAriaLabelledby"
        :aria-description="
          t('el.colorpicker.description', { color: modelValue || '' })
        "
        :tabindex="tabindex"
        @keydown.enter="handleTrigger"
      >
        <div v-if="colorDisabled" :class="ns.be('picker', 'mask')" />
        <div :class="ns.be('picker', 'trigger')" @click="handleTrigger">
          <span :class="[ns.be('picker', 'color'), ns.is('alpha', showAlpha)]">
            <span
              :class="ns.be('picker', 'color-inner')"
              :style="{
                backgroundColor: displayedColor,
              }"
            >
              <lp-icon
                v-show="modelValue || showPanelColor"
                :class="[ns.be('picker', 'icon'), ns.is('icon-arrow-down')]"
              >
                <arrow-down />
              </lp-icon>
              <lp-icon
                v-if="!modelValue && !showPanelColor"
                :class="[ns.be('picker', 'empty'), ns.is('icon-close')]"
              >
                <close />
              </lp-icon>
            </span>
          </span>
        </div>
      </div>
    </template>
  </lp-tooltip>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, provide, reactive, ref, watch } from 'vue';
import { debounce } from 'lodash-es';
import { LpButton } from '@lemon-peel/components/button';
import { LpIcon } from '@lemon-peel/components/icon';
import { ClickOutside as vClickOutside } from '@lemon-peel/directives';
import { useDisabled, useFormItem, useFormItemInputId, useLocale, useNamespace, useSize } from '@lemon-peel/hooks';
import { LpTooltip } from '@lemon-peel/components/tooltip';
import { LpInput } from '@lemon-peel/components/input';
import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { debugWarn } from '@lemon-peel/utils';
import { ArrowDown } from '@element-plus/icons-vue';
import type AlphaSlider from './components/AlphaSlider.vue';
import type HueSlider from './components/HueSlider.vue';
import Predefine from './components/Predefine.vue';
import type SvPanel from './components/SvPanel.vue';
import Color from './utils/color';
import { colorPickerContextKey, colorPickerEmits, colorPickerProps } from './colorPicker';
import type { TooltipInstance } from '@lemon-peel/components/tooltip';

defineOptions({
  name: 'LpColorPicker',
});
const props = defineProps(colorPickerProps);
const emit = defineEmits(colorPickerEmits);

const { t } = useLocale();
const ns = useNamespace('color');
const { formItem } = useFormItem();
const colorSize = useSize();
const colorDisabled = useDisabled();

const { inputId: buttonId, isLabeledByFormItem } = useFormItemInputId(props, {
  formItemContext: formItem,
});

const hue = ref<InstanceType<typeof HueSlider>>();
const sv = ref<InstanceType<typeof SvPanel>>();
const alpha = ref<InstanceType<typeof AlphaSlider>>();
const popper = ref<TooltipInstance>();

// active-change is used to prevent modelValue changes from triggering.
let shouldActiveChange = true;

const color = reactive(
  new Color({
    enableAlpha: props.showAlpha,
    format: props.colorFormat || '',
    value: props.modelValue,
  }),
) as Color;

const showPicker = ref(false);
const showPanelColor = ref(false);
const customInput = ref('');

function displayedRgb(colorObject: Color, showAlpha: boolean) {
  if (!(colorObject instanceof Color)) {
    throw new TypeError('color should be instance of _color Class');
  }

  const { r, g, b } = colorObject.toRgb();
  return showAlpha
    ? `rgba(${r}, ${g}, ${b}, ${colorObject.get('alpha') / 100})`
    : `rgb(${r}, ${g}, ${b})`;
}

const displayedColor = computed(() => {
  if (!props.modelValue && !showPanelColor.value) {
    return 'transparent';
  }
  return displayedRgb(color, props.showAlpha);
});

const currentColor = computed(() => {
  return !props.modelValue && !showPanelColor.value ? '' : color.value;
});

const buttonAriaLabel = computed<string | undefined>(() => {
  return isLabeledByFormItem.value
    ? undefined
    : props.label || t('el.colorpicker.defaultLabel');
});

const buttonAriaLabelledby = computed<string | undefined>(() => {
  return isLabeledByFormItem.value ? formItem?.labelId : undefined;
});

function setShowPicker(value: boolean) {
  showPicker.value = value;
}

const debounceSetShowPicker = debounce(setShowPicker, 100);

function resetColor() {
  nextTick(() => {
    if (props.modelValue) {
      color.fromString(props.modelValue);
    } else {
      color.value = '';
      nextTick(() => {
        showPanelColor.value = false;
      });
    }
  });
}

function hide() {
  debounceSetShowPicker(false);
  resetColor();
}

function handleTrigger() {
  if (colorDisabled.value) return;
  debounceSetShowPicker(!showPicker.value);
}

function handleConfirm() {
  color.fromString(customInput.value);
}

function confirmValue() {
  const value = color.value;
  emit(UPDATE_MODEL_EVENT, value);
  emit('change', value);
  if (props.validateEvent) {
    formItem?.validate('change').catch(error => debugWarn(error));
  }
  debounceSetShowPicker(false);
  // check if modelValue change, if not change, then reset color.
  nextTick(() => {
    const newColor = new Color({
      enableAlpha: props.showAlpha,
      format: props.colorFormat || '',
      value: props.modelValue,
    });
    if (!color.compare(newColor)) {
      resetColor();
    }
  });
}

function clear() {
  debounceSetShowPicker(false);
  emit(UPDATE_MODEL_EVENT, null);
  emit('change', null);
  if (props.modelValue !== null && props.validateEvent) {
    formItem?.validate('change').catch(error => debugWarn(error));
  }
  resetColor();
}

onMounted(() => {
  if (props.modelValue) {
    customInput.value = currentColor.value;
  }
});

watch(
  () => props.modelValue,
  newValue => {
    if (!newValue) {
      showPanelColor.value = false;
    } else if (newValue && newValue !== color.value) {
      shouldActiveChange = false;
      color.fromString(newValue);
    }
  },
);

watch(
  () => currentColor.value,
  value => {
    customInput.value = value;
    shouldActiveChange && emit('activeChange', value);
    shouldActiveChange = true;
  },
);

watch(
  () => color.value,
  () => {
    if (!props.modelValue && !showPanelColor.value) {
      showPanelColor.value = true;
    }
  },
);

watch(
  () => showPicker.value,
  () => {
    nextTick(() => {
      hue.value?.update();
      sv.value?.update();
      alpha.value?.update();
    });
  },
);

provide(colorPickerContextKey, {
  currentColor,
});

defineExpose({
  color,
});
</script>
