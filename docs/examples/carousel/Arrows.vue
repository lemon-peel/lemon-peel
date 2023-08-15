<template>
  <lp-carousel :interval="5000" arrow="always">
    <lp-carousel-item v-for="item in 4" :key="item">
      <h3 text="2xl" justify="center">{{ item }}</h3>
    </lp-carousel-item>
  </lp-carousel>
</template>

<style scoped>
.lp-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.lp-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.lp-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
