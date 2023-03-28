<template>
  <el-sub-menu v-if="hasSubMenu && itemData.children && itemData.children.length > 0" :index="itemData.resourcesId">
    <template v-slot:title>
      <i :class="`iconfont ${itemData.icon}`"></i>
      <span class="mgl10">{{ itemData.name }}</span>
    </template>

    <HxMenuItem v-for="(item, index) in itemData.children" :key="index" :itemData="item" />
  </el-sub-menu>

  <template v-else>
    <el-menu-item v-if="itemData.type == 'left'" :index="itemData.url" :key="itemData.resourcesId">
      <template v-slot:title>
        <i :class="`iconfont ${itemData.icon}`"></i>
        <span class="mgl10">{{ itemData.name }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup="props">
import { computed, toRefs } from "vue";

interface Props {
  itemData: Menu.Item;
}

const props = defineProps<Props>();

const { itemData } = toRefs(props);

const hasSubMenu = computed(() => {
  if (itemData.value.children && itemData.value.children.length) {
    return itemData.value.children.some((item) => item.type == "left");
  }
  return false;
});
</script>

<style lang="less" scoped>
.icon {
  width: 16px;
  display: inline-block;
  text-align: center;
}
.el-menu-item {
  line-height: 12px;
}
</style>
