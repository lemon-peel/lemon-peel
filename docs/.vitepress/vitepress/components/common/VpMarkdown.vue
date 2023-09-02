<script lang="ts" setup>
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const props = defineProps({
  content: { type: String, required: true },
});

const attr = 'rel="noreferrer noopenner" target="_blank"';

const parsed = computed(() => {
  // Note this is relatively arbitrary so that this could be buggy.
  return md
    .render(props.content)
    .replaceAll(
      /#(\d+) by/,
      `<a href="https://github.com/element-plus/element-plus/pull/$1" ${attr}>#$1</a> by`,
    )
    .replaceAll(
      /@([\w-]+)/,
      `<a href="https://github.com/$1" ${attr}>@$1</a>`,
    );
});
</script>

<template>
  <div class="markdown-wrapper" v-html="parsed" />
</template>

<style>
.markdown-wrapper h3 {
  margin-top: 1rem;
}
</style>
