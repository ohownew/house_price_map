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
          <el-menu-item v-for="(item, index) in districts" :index="`${index}`">{{ item[0] }}</el-menu-item>
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
const districts = ref([
    ['罗湖区', 114.14312021034308, 22.577590531325097],
    ['福田区', 114.0446201887346, 22.549203064656897],
    ['南山区', 113.93615586602698, 22.553139483645754],
    ['宝安区', 113.85728868757083, 22.68400030713536],
    ['盐田区', 114.26608846307737, 22.59870987895339],
    ['龙华区', 114.02979607735925, 22.68685416924557],
    ['大鹏新区', 114.49796743711808, 22.57948354439653],
    ['龙岗区', 114.20670288520662, 22.695592730801433],
    ['光明区', 113.92647346606621, 22.76617659337744],
    ['坪山区', 114.3572535468446, 22.69105985015741]
]);

const handleSelect = (key, keyPath) => {
  activeIndex.value = key;
  currentComponent.value = componets[key];
}

</script>

<style scoped>
</style>
