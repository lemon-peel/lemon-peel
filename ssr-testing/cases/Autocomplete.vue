<template>
  <lp-row class="demo-autocomplete text-center">
    <lp-col :span="12">
      <div class="sub-title my-2 text-sm text-gray-600">
        list suggestions when activated
      </div>
      <lp-autocomplete
        v-model:value="state1"
        :fetch-suggestions="querySearch"
        class="inline-input"
        placeholder="Please Input"
        @select="handleSelect"
      />
    </lp-col>
    <lp-col :span="12">
      <div class="sub-title my-2 text-sm text-gray-600">
        list suggestions on input
      </div>
      <lp-autocomplete
        v-model:value="state2"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        class="inline-input"
        placeholder="Please Input"
        @select="handleSelect"
      />
    </lp-col>
  </lp-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface RestaurantItem {
  value: string;
  link: string;
}

const state1 = ref('');
const state2 = ref('');

const restaurants = ref<RestaurantItem[]>([]);
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value;
  // call callback function to return suggestions
  cb(results);
};
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};

const handleSelect = () => {
  //
};
</script>
