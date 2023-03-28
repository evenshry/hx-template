<template>
  <el-aside class="hx-template-aside" v-loading="dataLoading">
    <el-menu unique-opened :default-active="currentPath" v-if="sideMenuList" router>
      <HxMenuItem v-for="(item, index) in sideMenuList" :itemData="item" :key="index" />
    </el-menu>
  </el-aside>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs, onMounted } from "vue";
import HxMenuItem from "./HxMenuItem.vue";
import { usePiniaStore } from "@/store";
import { fetchMenuList } from "../api";
import { useRoute } from "vue-router";

const { SysRoleStore } = usePiniaStore();

interface Props {
  sideMenuIndex: number;
}

const route = useRoute();

const props = defineProps<Props>();

const emits = defineEmits(["getMenuList"]);

const { sideMenuIndex } = toRefs(props);

const dataLoading = ref<boolean>(false);

const topMenuList = ref<Menu.Item[]>([]);

const currentPath = computed(() => SysRoleStore.getCurrentPath);

const sideMenuList = computed(() => {
  if (topMenuList.value && topMenuList.value[sideMenuIndex.value || 0]) {
    return topMenuList.value[sideMenuIndex.value || 0].children || [];
  }
  return [];
});

onMounted(() => {
  loadMenuList();
  // 初始化时把Url路径赋值到仓库
  if (route.path) {
    SysRoleStore.setCurrentPath(route.path);
  }
});

/**
 * 加载侧边栏列表
 */
async function loadMenuList() {
  try {
    dataLoading.value = true;
    const response = await fetchMenuList();
    const data = response.data || [];
    // 顶部菜单
    topMenuList.value = data;
    emits("getMenuList", data);
    findConsoleMenus(data);
  } catch (error) {
    console.log(error);
  } finally {
    dataLoading.value = false;
  }
}

/**
 * 找到项目控制台菜单
 * @param list
 */
function findConsoleMenus(list: Array<Menu.Item>) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item.url && item.url.indexOf("/pages/project/console/index") > -1) {
      SysRoleStore.setConsoleMenus(item.children || []);
      break;
    } else {
      item.children && findConsoleMenus(item.children);
    }
  }
}
</script>

<style lang="less" scoped>
.hx-template-aside {
  width: 200px;
  height: 100%;
  overflow: auto;
  background-color: var(--background-color);
  border-top: 1px solid #3e4857;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: 0 0;
    pointer-events: none;
    box-sizing: border-box;
    border-right: 1px solid #dcdfe6;
  }
}
</style>
