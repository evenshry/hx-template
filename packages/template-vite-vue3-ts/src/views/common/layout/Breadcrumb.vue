<template>
  <section class="breadcrumb-section">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="index">
        {{ item.meta?.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-button link type="primary" @click="backToPrevPage" icon="el-icon-arrow-left" v-if="canBack" >返回到上一页面</el-button>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

interface RouteItem {
  path: string;
  meta?: MyRoute.RouteMeta;
}

const route = useRoute();
const router = useRouter();

const levelList = ref([] as RouteItem[]);

const canBack = computed(() => {
  const { meta } = route;
  return meta.canBack;
});

// 监听路由变化
watch(
  () => route,
  () => {
    getBreadcrumb();
  },
  { deep: true, immediate: true }
);

/**
 * 获取路由层级数据
 */
function getBreadcrumb() {
  // 获取路由层级
  levelList.value = route.matched.map((item) => ({
    path: item.path,
    meta: item.meta
  }));
  // 移除第一级
  levelList.value.shift();
}

/**
 * 返回上一页
 */
function backToPrevPage() {
  router.back();
}
</script>

<style lang="less" scoped>
.breadcrumb-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  background-color: #fff;
  box-shadow: 0 4px 5px 0px rgba(0, 0, 0, 0.05);
  padding-left: 20px;
  padding-right: 20px;
}
</style>
