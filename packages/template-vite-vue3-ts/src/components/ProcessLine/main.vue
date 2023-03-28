<template>
  <div class="processLine">
    <div class="processItem" v-for="(item, index) in dataList" :key="index">
      <div class="iconWrapper">
        <div class="icon">
          <el-icon v-if="item.type == 'success'" class="color-success"><CircleCheckFilled /></el-icon>
          <el-icon v-else-if="item.type == 'danger'" class="color-danger"><CircleCloseFilled /></el-icon>
          <span v-else class="df" />
        </div>
        <div class="line" />
      </div>
      <div class="name">{{ item.title }}</div>
      <div class="text">{{ item.text }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup="props">
import { toRefs } from "vue";
import { CircleCheckFilled, CircleCloseFilled } from "@element-plus/icons-vue";
import { ProcessLineItem } from "./index";

const props = defineProps<{ dataList: Array<ProcessLineItem> }>();

const { dataList } = toRefs(props);
</script>

<style lang="less" scoped>
.processLine {
  display: flex;
  .processItem {
    position: relative;
    width: 150px;
    .iconWrapper {
      display: flex;
      align-items: center;
      position: relative;
      left: 5px;
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 16px;
        .df {
          display: block;
          width: 14px;
          height: 14px;
          background-color: #ddd;
          border-radius: 50%;
        }
      }
      .line {
        flex: 1;
        // margin: 0 2px;
        border-bottom: 1px solid #d9d9d9;
      }
    }
    &:last-child .line {
      border: none;
    }

    .name {
      font-size: 14px;
      color: #333;
      margin-top: 5px;
    }
    .text {
      line-height: 20px;
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
