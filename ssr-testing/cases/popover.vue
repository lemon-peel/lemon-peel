<template>
  <lp-popover
    ref="popover"
    placement="right"
    title="Title"
    :width="200"
    trigger="focus"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <lp-button>Focus to activate</lp-button>
    </template>
  </lp-popover>
</template>
