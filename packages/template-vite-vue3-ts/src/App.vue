<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";

// element-plus 中文
const locale = ref(zhCn);
</script>

<style>
html {
  height: 100%;
  overflow: hidden;
}

body {
  height: 100%;
  overflow: hidden;
  background-color: #f9f9f9;
}

* {
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
  overflow: hidden;
}
</style>
