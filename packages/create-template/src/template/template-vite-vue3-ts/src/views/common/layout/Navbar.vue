<template>
  <el-header class="hx-template-header">
    <div class="hx-logo">
      <el-image :src="ImageLogo" class="logo" fit="contain" />
    </div>

    <div class="headerFill">
      <!--Header Menu-->
      <div v-if="navMenuList" class="menuWrapper">
        <div
          v-for="(item, index) in navMenuList"
          :key="index"
          class="menuItem"
          :class="{ active: menuIndex == index }"
          @click="handleChange(item, index)"
        >
          <span class="title">{{ item.name }}</span>
        </div>
      </div>

      <div class="rightWrapper">
        <el-dropdown>
          <div class="infoWrapper">
            <el-image :src="ImageAvatar" class="avatar" fit="contain" />
            <div class="text">{{ roleData.name || "-" }}</div>
            <el-icon class="text"><CaretBottom /></el-icon>
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogut">
                <i class="fa fa-sign-out text" />
                <span class="text">退出账号</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- <el-button link @click="handleLogut">
          <i class="fa fa-sign-out text" />
          <span class="text">退出</span>
        </el-button> -->
      </div>
    </div>
  </el-header>
</template>

<script lang="ts" setup="props">
import { computed, toRefs, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { usePiniaStore } from "@/store";
import querystring from "@/utils/http/querystring";
import { logout, fetchUserInfo } from "../api";

import { ImageLogo } from "@/mock/image";
import ImageAvatar from "@/assets/images/avatar.png";

interface Props {
  navMenuList: Menu.Item[];
  menuIndex: number;
}

const { SysRoleStore } = usePiniaStore();

const props = defineProps<Props>();

const emits = defineEmits(["changeMenuIndex"]);

const { navMenuList, menuIndex } = toRefs(props);

const currentPath = computed(() => SysRoleStore.getCurrentPath);

const roleData = computed(() => SysRoleStore.getRoleData);

const router = useRouter();

watch(
  () => navMenuList.value,
  (data) => {
    if (data && data.length && currentPath.value) {
      const index = data.findIndex((item) => currentPath.value.indexOf(item.url || "") > -1);
      handleChange({}, index);
    }
  }
);

onMounted(() => {
  loadUserInfo();
});

/**
 * 加载我的信息
 */
async function loadUserInfo() {
  try {
    const response = await fetchUserInfo();
    const data = response.data || {};
    SysRoleStore.setRoleData(data);
  } catch (error) {
    console.log(error);
  }
}

/**
 * 点击菜单切换
 * @param item
 * @param index
 */
function handleChange(item: Menu.Item, index: number) {
  if (item.resourcesId && !item.children && item.url) {
    router.push({ path: item.url });
  }
  if (item.resourcesId && item.children && item.children.length > 0) {
    const url = item.children[0].url;
    if (url) {
      const temp = querystring.parseUrl(url);
      router.push({ path: temp.path, query: temp.query });
    }
  }
  emits("changeMenuIndex", index);
}

/**
 * 退出确认
 */
function handleLogut() {
  ElMessageBox.confirm("确认退出吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      await logout();
      SysRoleStore.clear();
      ElMessage.success("退出成功!");
      router.replace({ name: "login" });
    })
    .catch((error) => {
      console.log(error);
      ElMessage.info("取消退出");
    });
}
</script>

<style lang="less" scoped>
.hx-template-header {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #262f3e;
  height: 60px;
  .hx-logo {
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      width: 200px;
      height: 60px;
    }
  }
  .headerFill {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .menuWrapper {
      display: flex;
      height: 100%;
      .menuItem {
        width: 140px;
        height: 100%;
        cursor: pointer;
        text-align: center;
        transition: all linear 0.3s;
        .title {
          display: inline-block;
          height: 100%;
          line-height: 60px;
          position: relative;
          transition: all linear 0.3s;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.5);
          &::after {
            content: " ";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            width: 0;
            height: 4px;
            background-color: #fff;
            transition: all linear 0.1s;
          }
        }
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
          .title {
            color: #fff;
          }
        }
        &.active {
          .title {
            font-weight: 500;
            color: #fff;
            &::after {
              width: 100%;
            }
          }
        }
      }
    }
    .rightWrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      margin-right: 10px;
      .infoWrapper {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin: 10px;
        &:focus {
          outline: none;
        }
        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 20px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
