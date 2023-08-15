<template>
  <lp-calendar ref="calendar">
    <template #header="{ date }">
      <span>Custom header content</span>
      <span>{{ date }}</span>
      <lp-button-group>
        <lp-button size="small" @click="selectDate('prev-year')">
          Previous Year
        </lp-button>
        <lp-button size="small" @click="selectDate('prev-month')">
          Previous Month
        </lp-button>
        <lp-button size="small" @click="selectDate('today')">Today</lp-button>
        <lp-button size="small" @click="selectDate('next-month')">
          Next Month
        </lp-button>
        <lp-button size="small" @click="selectDate('next-year')">
          Next Year
        </lp-button>
      </lp-button-group>
    </template>
  </lp-calendar>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const calendar = ref();
const selectDate = (val: string) => {
  calendar.value.selectDate(val);
};
</script>
