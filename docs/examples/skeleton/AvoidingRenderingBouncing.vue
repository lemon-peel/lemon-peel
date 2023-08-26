<template>
  <lp-space direction="vertical" alignment="flex-start">
    <div>
      <label style="margin-right: 16px">Switch Loading</label>
      <lp-switch v-model:value="loading" />
    </div>
    <lp-skeleton
      style="width: 240px"
      :loading="loading"
      animated
      :throttle="500"
    >
      <template #template>
        <lp-skeleton-item variant="image" style="width: 240px; height: 240px" />
        <div style="padding: 14px">
          <lp-skeleton-item variant="h3" style="width: 50%" />
          <div
            style="
              display: flex;
              align-items: center;
              justify-items: space-between;
              margin-top: 16px;
              height: 16px;
            "
          >
            <lp-skeleton-item variant="text" style="margin-right: 16px" />
            <lp-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
      <template #default>
        <lp-card :body-style="{ padding: '0px', marginBottom: '1px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          >
          <div style="padding: 14px">
            <span>Delicious hamburger</span>
            <div class="bottom card-header">
              <div class="time">{{ currentDate }}</div>
              <lp-button text class="button">operation button</lp-button>
            </div>
          </div>
        </lp-card>
      </template>
    </lp-skeleton>
  </lp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const loading = ref(false);
const currentDate = new Date().toDateString();
</script>
