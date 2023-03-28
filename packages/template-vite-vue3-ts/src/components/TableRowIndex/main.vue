<template>
  <el-table-column fixed="left" label="序号" width="60" align="center">
    <template v-slot:default="scope">
      <span :class="classMapKey ? draftColorMap[scope.row[classMapKey]] : ''">
        {{ getSequence(scope.$index) }}
      </span>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup="props">
import { toRefs } from "vue";
import { draftColorMap } from "./const";

const props = withDefaults(
  defineProps<{
    pageIndex?: number;
    pageSize?: number;
    classMapKey?: string;
  }>(),
  {
    pageIndex: 0,
    pageSize: 0
  }
);

const { pageIndex, pageSize, classMapKey } = toRefs(props);

/**
 * 获取序号
 */
function getSequence(index: number) {
  if (pageIndex && pageIndex?.value > 1) {
    return (pageIndex.value - 1) * pageSize.value + index + 1;
  }
  return index + 1;
}
</script>
