<template>
  <div class="flex items-center mb-4">
    <lp-radio-group v-model:value="small" class="mr-4">
      <lp-radio-button :label="false">default</lp-radio-button>
      <lp-radio-button :label="true">small</lp-radio-button>
    </lp-radio-group>
    <div>
      background:
      <lp-switch v-model:value="background" class="ml-2" />
    </div>
    <div class="ml-4">
      disabled: <lp-switch v-model:value="disabled" class="ml-2" />
    </div>
  </div>

  <hr class="my-4">

  <div class="demo-pagination-block">
    <div class="demonstration">Total item count</div>
    <lp-pagination
      v-model:currentPage="currentPage1"
      :page-size="100"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, prev, pager, next"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <div class="demo-pagination-block">
    <div class="demonstration">Change page size</div>
    <lp-pagination
      v-model:currentPage="currentPage2"
      v-model:page-size="pageSize2"
      :page-sizes="[100, 200, 300, 400]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="sizes, prev, pager, next"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <div class="demo-pagination-block">
    <div class="demonstration">Jump to</div>
    <lp-pagination
      v-model:currentPage="currentPage3"
      v-model:page-size="pageSize3"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <div class="demo-pagination-block">
    <div class="demonstration">All combined</div>
    <lp-pagination
      v-model:currentPage="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[100, 200, 300, 400]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const currentPage1 = ref(5);
const currentPage2 = ref(5);
const currentPage3 = ref(5);
const currentPage4 = ref(4);
const pageSize2 = ref(100);
const pageSize3 = ref(100);
const pageSize4 = ref(100);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>

<style scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>
