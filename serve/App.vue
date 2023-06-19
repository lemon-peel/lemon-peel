<template>
  <div class="app__linkWrap">
    <router-link v-for="item in routers" :key="item.path" :to="item.path">{{ item.name }}</router-link>
  </div>
  <div class="app__demoWrap">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// code here
import { useRouter } from 'vue-router';
const router = useRouter();
const routers = router.getRoutes();
</script>

<style lang="scss">

html,
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  background: #f0f0f0;

  #playground {
    height: 100%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
}

.app__linkWrap {
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  margin-bottom: 20px;

  a {
    margin: 0 10px;
  }
}

.app__demoWrap {
  flex-grow: 1;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  background-image: url("data:image/svg+xml,%3C?xml version='1.0' encoding='UTF-8'?%3E%3Csvg width='400px' height='400px' viewBox='0 0 400 400' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E    %3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E        %3Cg%3E            %3Crect x='0' y='0' width='400' height='400'%3E%3C/rect%3E            %3Ctext id='Playground' transform='translate(200.316267, 199.843351) rotate(-35.000000) translate(-200.316267, -199.843351) ' font-family='PingFangSC-Ultralight, PingFang SC' font-size='36' font-weight='200' fill='%23F0F0F0'%3E                %3Ctspan x='111.816267' y='212.843351'%3ELemon-Peel%3C/tspan%3E            %3C/text%3E        %3C/g%3E    %3C/g%3E%3C/svg%3E");
}
</style>
