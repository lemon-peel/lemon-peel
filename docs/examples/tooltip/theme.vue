<template>
  <lp-tooltip content="Top center" placement="top">
    <lp-button>Dark</lp-button>
  </lp-tooltip>
  <lp-tooltip content="Bottom center" placement="bottom" effect="light">
    <lp-button>Light</lp-button>
  </lp-tooltip>

  <lp-tooltip content="Bottom center" effect="customized">
    <lp-button>Customized theme</lp-button>
  </lp-tooltip>
</template>

<style>
.lp-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.lp-popper.is-customized .lp-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>
