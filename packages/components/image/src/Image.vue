<template>
  <div ref="container" :class="[ns.b(), $attrs.class]" :style="containerStyle">
    <img
      v-if="imageSrc !== undefined && !hasLoadError"
      v-bind="attrs"
      :src="imageSrc"
      :loading="loading"
      :style="imageStyle"
      :class="[
        ns.e('inner'),
        preview && ns.e('preview'),
        isLoading && ns.is('loading'),
      ]"
      @click="clickHandler"
      @load="handleLoad"
      @error="handleError"
    >
    <div v-if="isLoading || hasLoadError" :class="ns.e('wrapper')">
      <slot v-if="isLoading" name="placeholder">
        <div :class="ns.e('placeholder')" />
      </slot>
      <slot v-else-if="hasLoadError" name="error">
        <div :class="ns.e('error')">{{ t('lp.image.error') }}</div>
      </slot>
    </div>
    <template v-if="preview">
      <image-viewer
        v-if="showViewer"
        :z-index="zIndex"
        :initial-index="imageIndex"
        :infinite="infinite"
        :url-list="previewSrcList"
        :hide-on-click-modal="hideOnClickModal"
        :teleported="previewTeleported"
        :close-on-press-escape="closeOnPressEscape"
        @close="closeViewer"
        @switch="switchViewer"
      >
        <div v-if="$slots.viewer">
          <slot name="viewer" />
        </div>
      </image-viewer>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, useAttrs as useRawAttributes, watch } from 'vue';
import { isClient, useEventListener, useThrottleFn } from '@vueuse/core';
import { useAttrs, useLocale, useNamespace } from '@lemon-peel/hooks';
import ImageViewer from '@lemon-peel/components/imageViewer';
import { getScrollContainer, isElement, isInContainer, isString } from '@lemon-peel/utils';
import { imageEmits, imageProps } from './image';

import type { CSSProperties, StyleValue } from 'vue';

defineOptions({
  name: 'LpImage',
  inheritAttrs: false,
});

const props = defineProps(imageProps);
const emit = defineEmits(imageEmits);

let previousOverflow = '';

const { t } = useLocale();
const ns = useNamespace('image');
const rawAttrs = useRawAttributes();
const attrs = useAttrs();

const imageSrc = ref<string | undefined>();
const hasLoadError = ref(false);
const isLoading = ref(true);
const showViewer = ref(false);
const container = ref<HTMLElement>();
const scrollIn = ref<HTMLElement | Window>();

const supportLoading = isClient && 'loading' in HTMLImageElement.prototype;
let stopScrollListener: (() => void) | undefined;
let stopWheelListener: (() => void) | undefined;

const containerStyle = computed(() => rawAttrs.style as StyleValue);

const imageStyle = computed(() => {
  const { fit } = props;
  return (isClient && fit ? { objectFit: fit } : {}) as CSSProperties;
});

const preview = computed(() => {
  const { previewSrcList } = props;
  return Array.isArray(previewSrcList) && previewSrcList.length > 0;
});

const imageIndex = computed(() => {
  const { previewSrcList, initialIndex } = props;
  let previewIndex = initialIndex;
  if (initialIndex > previewSrcList.length - 1) {
    previewIndex = 0;
  }
  return previewIndex;
});

const isManual = computed(() => {
  if (props.loading === 'eager') return false;
  return (!supportLoading && props.loading === 'lazy') || props.lazy;
});

const loadImage = () => {
  if (!isClient) return;

  // reset status
  isLoading.value = true;
  hasLoadError.value = false;
  imageSrc.value = props.src;
};

function handleLoad(event: Event) {
  isLoading.value = false;
  hasLoadError.value = false;
  emit('load', event);
}

function handleError(event: Event) {
  isLoading.value = false;
  hasLoadError.value = true;
  emit('error', event);
}

function handleLazyLoad() {
  if (isInContainer(container.value, scrollIn.value)) {
    loadImage();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    removeLazyLoadListener();
  }
}

const lazyLoadHandler = useThrottleFn(handleLazyLoad, 200);

function removeLazyLoadListener() {
  if (!isClient || !scrollIn.value || !lazyLoadHandler) return;

  stopScrollListener?.();
  scrollIn.value = undefined;
}

async function addLazyLoadListener() {
  if (!isClient) return;

  await nextTick();

  const { scrollContainer } = props;
  if (isElement(scrollContainer)) {
    scrollIn.value = scrollContainer;
  } else if (isString(scrollContainer) && scrollContainer !== '') {
    scrollIn.value =
      document.querySelector<HTMLElement>(scrollContainer) ?? undefined;
  } else if (container.value) {
    scrollIn.value = getScrollContainer(container.value);
  }

  if (scrollIn.value) {
    stopScrollListener = useEventListener(
      scrollIn,
      'scroll',
      lazyLoadHandler,
    );
    setTimeout(() => handleLazyLoad(), 100);
  }
}

function wheelHandler(e: WheelEvent) {
  if (!e.ctrlKey) return;

  if (e.deltaY < 0) {
    e.preventDefault();
    return false;
  } else if (e.deltaY > 0) {
    e.preventDefault();
    return false;
  }
}

function clickHandler() {
  // don't show viewer when preview is false
  if (!preview.value) return;

  stopWheelListener = useEventListener('wheel', wheelHandler, {
    passive: false,
  });

  // prevent body scroll
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  showViewer.value = true;
  emit('show');
}

function closeViewer() {
  stopWheelListener?.();
  document.body.style.overflow = previousOverflow;
  showViewer.value = false;
  emit('close');
}

function switchViewer(value: number) {
  emit('switch', value);
}

watch(
  () => props.src,
  () => {
    if (isManual.value) {
      // reset status
      isLoading.value = true;
      hasLoadError.value = false;
      removeLazyLoadListener();
      addLazyLoadListener();
    } else {
      loadImage();
    }
  },
);

onMounted(() => {
  if (isManual.value) {
    addLazyLoadListener();
  } else {
    loadImage();
  }
});
</script>
