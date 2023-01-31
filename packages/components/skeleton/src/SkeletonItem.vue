<template>
  <div :class="[ns.e('item'), ns.e(variant)]">
    <picture-filled v-if="variant === 'image'" />
  </div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lemon-peel/hooks';
import { PictureFilled } from '@element-plus/icons-vue';
import { skeletonItemProps } from './skeletonItem';

defineOptions({
  name: 'LpSkeletonItem',
});
defineProps(skeletonItemProps);
const ns = useNamespace('skeleton');
</script>
