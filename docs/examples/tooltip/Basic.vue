<template>
  <div class="tooltip-base-box">
    <div class="row center">
      <lp-tooltip
        class="box-item"
        effect="dark"
        content="Top Left prompts info"
        placement="top-start"
      >
        <lp-button>top-start</lp-button>
      </lp-tooltip>
      <lp-tooltip
        class="box-item"
        effect="dark"
        content="Top Center prompts info"
        placement="top"
      >
        <lp-button>top</lp-button>
      </lp-tooltip>
      <lp-tooltip
        class="box-item"
        effect="dark"
        content="Top Right prompts info"
        placement="top-end"
      >
        <lp-button>top-end</lp-button>
      </lp-tooltip>
    </div>
    <div class="row">
      <lp-tooltip
        class="box-item"
        effect="dark"
        content="Left Top prompts info"
        placement="left-start"
      >
        <lp-button>left-start</lp-button>
      </lp-tooltip>
      <lp-tooltip
        class="box-item"
        effect="dark"
        content="Right Top prompts info"
        placement="right-start"
      >
        <lp-button>right-start</lp-button>
      </lp-tooltip>
    </div>
    <div class="row">
      <lp-tooltip
        class="box-item"
        effect="dark"
        content="Left Center prompts info"
        placement="left"
      >
        <lp-button class="mt-3 mb-3">left</lp-button>
      </lp-tooltip>
      <lp-tooltip
        class="box-item"
        effect="dark"
        content="Right Center prompts info"
        placement="right"
      >
        <lp-button>right</lp-button>
      </lp-tooltip>
    </div>
    <div class="row">
      <lp-tooltip
        class="box-item"
        effect="dark"
        content="Left Bottom prompts info"
        placement="left-end"
      >
        <lp-button>left-end</lp-button>
      </lp-tooltip>
      <lp-tooltip
        class="box-item"
        effect="dark"
        content="Right Bottom prompts info"
        placement="right-end"
      >
        <lp-button>right-end</lp-button>
      </lp-tooltip>
    </div>
    <div class="row center">
      <lp-tooltip
        class="box-item"
        effect="dark"
        content="Bottom Left prompts info"
        placement="bottom-start"
      >
        <lp-button>bottom-start</lp-button>
      </lp-tooltip>
      <lp-tooltip
        class="box-item"
        effect="dark"
        content="Bottom Center prompts info"
        placement="bottom"
      >
        <lp-button>bottom</lp-button>
      </lp-tooltip>
      <lp-tooltip
        class="box-item"
        effect="dark"
        content="Bottom Right prompts info"
        placement="bottom-end"
      >
        <lp-button>bottom-end</lp-button>
      </lp-tooltip>
    </div>
  </div>
</template>

<style>
.tooltip-base-box {
  width: 600px;
}
.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tooltip-base-box .center {
  justify-content: center;
}
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}
</style>
