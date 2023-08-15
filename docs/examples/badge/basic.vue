<template>
  <lp-badge :value="12" class="item">
    <lp-button>comments</lp-button>
  </lp-badge>
  <lp-badge :value="3" class="item">
    <lp-button>replies</lp-button>
  </lp-badge>
  <lp-badge :value="1" class="item" type="primary">
    <lp-button>comments</lp-button>
  </lp-badge>
  <lp-badge :value="2" class="item" type="warning">
    <lp-button>replies</lp-button>
  </lp-badge>

  <lp-dropdown trigger="click">
    <span class="lp-dropdown-link">
      Click Me
      <lp-icon class="lp-icon--right"><caret-bottom /></lp-icon>
    </span>
    <template #dropdown>
      <lp-dropdown-menu>
        <lp-dropdown-item class="clearfix">
          comments
          <lp-badge class="mark" :value="12" />
        </lp-dropdown-item>
        <lp-dropdown-item class="clearfix">
          replies
          <lp-badge class="mark" :value="3" />
        </lp-dropdown-item>
      </lp-dropdown-menu>
    </template>
  </lp-dropdown>
</template>

<script lang="ts" setup>
import { CaretBottom } from '@element-plus/icons-vue';
</script>

<style scoped>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
.lp-dropdown {
  margin-top: 1.1rem;
}
</style>
