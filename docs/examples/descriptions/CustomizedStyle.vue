<template>
  <lp-descriptions title="Customized style list" :column="3" border>
    <lp-descriptions-item
      label="Username"
      label-align="right"
      align="center"
      label-class-name="my-label"
      class-name="my-content"
      width="150px"
    >kooriookami</lp-descriptions-item>
    <lp-descriptions-item label="Telephone" label-align="right" align="center">18100000000</lp-descriptions-item>
    <lp-descriptions-item label="Place" label-align="right" align="center">Suzhou</lp-descriptions-item>
    <lp-descriptions-item label="Remarks" label-align="right" align="center">
      <lp-tag size="small">School</lp-tag>
    </lp-descriptions-item>
    <lp-descriptions-item label="Address" label-align="right" align="center">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu
      Province</lp-descriptions-item>
  </lp-descriptions>
</template>
<style scoped>
.my-label {
  background: var(--el-color-success-light-9);
}
.my-content {
  background: var(--el-color-danger-light-9);
}
</style>
