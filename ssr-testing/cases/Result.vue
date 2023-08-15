<template>
  <lp-row>
    <lp-col :sm="12" :lg="6">
      <lp-result
        icon="success"
        title="Success Tip"
        sub-title="Please follow the instructions"
      >
        <template #extra>
          <lp-button type="primary">Back</lp-button>
        </template>
      </lp-result>
    </lp-col>
    <lp-col :sm="12" :lg="6">
      <lp-result
        icon="warning"
        title="Warning Tip"
        sub-title="Please follow the instructions"
      >
        <template #extra>
          <lp-button type="primary">Back</lp-button>
        </template>
      </lp-result>
    </lp-col>
    <lp-col :sm="12" :lg="6">
      <lp-result
        icon="error"
        title="Error Tip"
        sub-title="Please follow the instructions"
      >
        <template #extra>
          <lp-button type="primary">Back</lp-button>
        </template>
      </lp-result>
    </lp-col>
    <lp-col :sm="12" :lg="6">
      <lp-result icon="info" title="Info Tip">
        <template #sub-title>
          <p>Using slot as subtitle</p>
        </template>
        <template #extra>
          <lp-button type="primary">Back</lp-button>
        </template>
      </lp-result>
    </lp-col>
  </lp-row>
</template>
