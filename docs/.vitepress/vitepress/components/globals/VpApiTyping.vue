<script setup lang="ts">
import { computed } from 'vue';
import { Warning } from '@element-plus/icons-vue';
import { useLang } from '../../composables/lang';

defineProps({
  type: { type: String, required: false, default: '' },
  details: { type: String, required: false, default: '' },
});

const lang = useLang();
const detail = computed(() => 'English');
</script>

<template>
  <span class="inline-flex items-center">
    <code class="api-typing mr-1">
      {{ type }}
    </code>
    <ClientOnly>
      <LpTooltip v-if="details" effect="light" trigger="click">
        <LpButton
          text
          :icon="Warning"
          :aria-label="detail"
          class="p-2 text-4"
        />
        <template #content>
          <slot>
            <div class="m-1" style="max-width: 600px">
              <code
                style="
                  color: var(--code-tooltip-color);
                  background-color: var(--code-tooltip-bg-color);
                "
              >
                {{ details }}
              </code>
            </div>
          </slot>
        </template>
      </LpTooltip>
    </ClientOnly>
  </span>
</template>
