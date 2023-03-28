<template>
  <router-view v-if="contentMode" />
  <el-container v-else class="hx-template-container" direction="vertical">
    <Navbar :navMenuList="navMenuList" :menuIndex="sideMenuIndex" @changeMenuIndex="changeMenuIndex" />

    <el-container class="hx-template-content">
      <Sidebar :sideMenuIndex="sideMenuIndex" @getMenuList="getNavMenuList" />

      <el-container direction="vertical">
        <Breadcrumb />

        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import Navbar from "./common/layout/Navbar.vue";
import Sidebar from "./common/layout/Sidebar.vue";
import Breadcrumb from "./common/layout/Breadcrumb.vue";
import RouterView from "./common/layout/RouterView.vue";

const route = useRoute();

const navMenuList = ref<Menu.Item[]>([]);

const sideMenuIndex = ref<number>(0);

function getNavMenuList(data: Menu.Item[]) {
  navMenuList.value = data;
}

function changeMenuIndex(value: number) {
  sideMenuIndex.value = value;
}

const contentMode = computed(() => {
  return route.query && route.query.contentMode == "1";
});
</script>

<style lang="less" scoped>
.hx-template-container {
  position: relative;
  height: 100%;
  overflow: hidden;
  .hx-template-content {
    height: calc(100% - 60px);
    overflow: hidden;
  }
}
</style>
