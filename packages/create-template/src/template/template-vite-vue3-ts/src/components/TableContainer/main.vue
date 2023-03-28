<template>
  <div class="hx-table-container" :class="{ cardMode: cardMode }" v-loading="loading">
    <div class="actions">
      <div class="title" v-if="title" :class="{ small: small }">{{ title }}</div>
      <div class="buttons">
        <slot name="buttons"></slot>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>

    <div v-if="showFooter" class="footer clearfix spacing-md">
      <el-row type="flex" justify="end">
        <el-pagination
          background
          v-if="(showPager || Number(pageInfo.totalCount)) && pageInfo.totalCount != 0"
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange"
          :current-page="pageInfo.page"
          :page-size="pageInfo.pageLimit"
          :total="pageInfo.totalCount"
          :page-sizes="pageSizes"
          :small="small"
          layout="total,sizes,prev,pager,next,jumper"
          class="fr mgt10 align-right"
        />
      </el-row>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup="props">
import { toRefs, watch } from "vue";

interface Props {
  title?: string;
  cardMode?: boolean;
  loading?: boolean;
  pageInfo?: Common.Pagination<any>;
  pageSizes?: Array<number>;
  showPager?: boolean;
  showFooter?: boolean;
  small?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  cardMode: true,
  pageInfo: () => ({ page: 1, pageLimit: 20, totalCount: 0 }),
  pageSizes: () => [20, 50, 100],
  showFooter: () => true,
  small: () => false
});

const emit = defineEmits(["page-current-change", "page-size-change"]);

const { title, cardMode, loading, pageInfo, pageSizes, showPager, showFooter, small } = toRefs(props);

// 监听数据长度
watch(
  () => pageInfo?.value.entries,
  (value) => {
    const pageInfoValue = pageInfo.value;
    // 当跳转到第 N 页后，执行删除操作， 将 N 页数据删除完之后回到 N-1 页
    if (((value && value.length == 0) || !value || value == null) && pageInfoValue.page && pageInfoValue.page > 1) {
      emit("page-current-change", pageInfoValue.page - 1);
    }
  },
  { immediate: true, deep: true }
);

/**
 * 翻页
 */
function pageCurrentChange(...arg: any) {
  emit("page-current-change", ...arg);
}

/**
 * 改变每页长度
 */
function pageSizeChange(...arg: any) {
  emit("page-size-change", ...arg);
}
</script>

<style lang="scss" scoped>
// table-result
.hx-table-container {
  position: relative;
  &.cardMode {
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0 0 5px 4px rgba(0, 0, 0, 0.05);
    background-color: #ffffff;
  }
  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 20px;
      font-weight: bold;
      color: var(--primary-color);
      line-height: 40px;
      margin-left: 5px;
      margin-right: 20px;
      flex: 1;
      &.small {
        font-size: 16px;
        line-height: 30px;
      }
    }
    .buttons {
      position: relative;
    }
  }
  .content {
    margin-top: 10px;
  }
}
</style>
