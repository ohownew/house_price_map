<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="home"><el-text class="mx-1" size="large" tag="b">深圳房价地图</el-text></el-menu-item>
        <el-menu-item index="community">小区点位</el-menu-item>
        <el-menu-item index="district">区县统计</el-menu-item>
        <el-sub-menu index="street">
          <template #title>街道统计</template>
          <el-menu-item index="shenzhen">全深圳</el-menu-item>
          <el-menu-item index="yes">福田 开发中...</el-menu-item>
          <el-menu-item index="ok">开发中...</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="hotmap">
          <template #title>热力图</template>
          <el-menu-item index="2-1">开发中...</el-menu-item>
          <el-menu-item index="2-2">开发中...</el-menu-item>
          <el-menu-item index="2-3">开发中...</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="layout">查看小区所有户型</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <component :is="currentComponent"></component>
      <!-- <CommunityPOI /> -->
    </el-main>
  </el-container>
  <!-- <Bar /> -->
</template>

<script setup>
// import Bar from './components/Bar.vue';
import CommunityPOI from './components/CommunityPOI.vue';
import DistrictTotal from './components/DistrictTotal.vue';
import Layout from './components/Layout.vue';  
import { ref } from 'vue';

const activeIndex = ref('home'); // 默认的导航栏index
const currentComponent = ref(CommunityPOI);
const componets = {
  'home': CommunityPOI,
  'community': CommunityPOI,
  'district': DistrictTotal,
  'layout': Layout
};

const handleSelect = (key, keyPath) => {
  activeIndex.value = key;
  currentComponent.value = componets[key];
}

</script>

<style scoped>
</style>
