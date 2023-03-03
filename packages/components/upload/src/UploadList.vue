<template>
  <transition-group
    tag="ul"
    :class="[
      nsUpload.b('list'),
      nsUpload.bm('list', listType),
      nsUpload.is('disabled', disabled),
    ]"
    :name="nsList.b()"
  >
    <li
      v-for="file in files"
      :key="file.uid || file.name"
      :class="[
        nsUpload.be('list', 'item'),
        nsUpload.is(file.status),
        { focusing },
      ]"
      tabindex="0"
      @keydown.delete="!disabled && handleRemove(file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file">
        <img
          v-if="
            listType === 'picture' ||
              (file.status !== 'uploading' && listType === 'picture-card')
          "
          :class="nsUpload.be('list', 'item-thumbnail')"
          :src="file.url"
          alt=""
        >
        <div
          v-if="file.status === 'uploading' || listType !== 'picture-card'"
          :class="nsUpload.be('list', 'item-info')"
        >
          <a
            :class="nsUpload.be('list', 'item-name')"
            @click.prevent="handlePreview(file)"
          >
            <lp-icon :class="nsIcon.m('document')"><Document /></lp-icon>
            <span :class="nsUpload.be('list', 'item-file-name')">
              {{ file.name }}
            </span>
          </a>
          <lp-progress
            v-if="file.status === 'uploading'"
            :type="listType === 'picture-card' ? 'circle' : 'line'"
            :stroke-width="listType === 'picture-card' ? 6 : 2"
            :percentage="Number(file.percentage)"
            :style="listType === 'picture-card' ? '' : 'margin-top: 0.5rem'"
          />
        </div>

        <label :class="nsUpload.be('list', 'item-status-label')">
          <lp-icon
            v-if="listType === 'text'"
            :class="[nsIcon.m('upload-success'), nsIcon.m('circle-check')]"
          >
            <circle-check />
          </lp-icon>
          <lp-icon
            v-else-if="['picture-card', 'picture'].includes(listType)"
            :class="[nsIcon.m('upload-success'), nsIcon.m('check')]"
          >
            <Check />
          </lp-icon>
        </label>
        <lp-icon
          v-if="!disabled"
          :class="nsIcon.m('close')"
          @click="handleRemove(file)"
        >
          <Close />
        </lp-icon>
        <!-- Due to close btn only appears when li gets focused disappears after li gets blurred, thus keyboard navigation can never reach close btn-->
        <!-- This is a bug which needs to be fixed -->
        <!-- TODO: Fix the incorrect navigation interaction -->
        <i v-if="!disabled" :class="nsIcon.m('close-tip')">{{
          t('lp.upload.deleteTip')
        }}</i>
        <span
          v-if="listType === 'picture-card'"
          :class="nsUpload.be('list', 'item-actions')"
        >
          <span
            :class="nsUpload.be('list', 'item-preview')"
            @click="handlePreview(file)"
          >
            <lp-icon :class="nsIcon.m('zoom-in')"><zoom-in /></lp-icon>
          </span>
          <span
            v-if="!disabled"
            :class="nsUpload.be('list', 'item-delete')"
            @click="handleRemove(file)"
          >
            <lp-icon :class="nsIcon.m('delete')"><Delete /></lp-icon>
          </span>
        </span>
      </slot>
    </li>
    <slot name="append" />
  </transition-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { LpIcon } from '@lemon-peel/components/icon';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
import { Check, CircleCheck, Close, Delete, Document, ZoomIn } from '@element-plus/icons-vue';
import LpProgress from '@lemon-peel/components/progress';

import { uploadListEmits, uploadListProps } from './uploadList';
import type { UploadFile } from './upload';

defineOptions({
  name: 'LpUploadList',
});

const props = defineProps(uploadListProps);
const emit = defineEmits(uploadListEmits);

const { t } = useLocale();
const nsUpload = useNamespace('upload');
const nsIcon = useNamespace('icon');
const nsList = useNamespace('list');

const focusing = ref(false);

const handleRemove = (file: UploadFile) => {
  emit('remove', file);
};
</script>
