<template>
  <div class="pageWrapper">
    <SearchForm :params="listParams" @on-search="handleSearch" input-key="name" placeholder="请输入文章名称" />

    <TableContainer
      :cardMode="false"
      :loading="dataLoading"
      :pageInfo="panigationData"
      @page-current-change="handlePageChange"
      @page-size-change="handleSizeChange"
    >
      <template v-slot:default>
        <div class="listContainer">
          <div class="itemContainer box-shadow" v-for="(item, index) in panigationData.entries" :key="index" @click="handleDetail(item)">
            <div class="imageWrapper" v-if="item.imageUrl">
              <el-image :src="item.imageUrl" class="image" fit="cover" />
            </div>

            <div class="titleWrapper">{{ item.title }}</div>

            <div class="textWrapper">
              <div class="type">{{ item.category }}</div>
              <div class="date">{{ item.publishTime }}</div>
            </div>
          </div>
        </div>
      </template>
    </TableContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({ name: "libraryList" });
</script>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import SearchForm from "./components/SearchForm.vue";
import { useMyState, usePagination } from "@/utils/hooks";
import { fetchKnowledgeLibList } from "./api";

const defaultParams: KnowledgeLib.FetchParams = {
  title: "",
  status: "",
  page: 1,
  pageLimit: 20
};

const router = useRouter();

const [listParams] = useMyState<KnowledgeLib.FetchParams>(defaultParams);

// 分页相关数据和方法
const { dataLoading, panigationData, loadPanigation, handlePageChange, handleSizeChange } = usePagination<KnowledgeLib.ListItem>(
  fetchKnowledgeLibList,
  listParams
);

onMounted(() => {
  loadPanigation();
});

/**
 * 点击查询
 */
function handleSearch(params: KnowledgeLib.FetchParams) {
  if (params) {
    listParams.value = { ...listParams.value, ...params };
  }
  listParams.value.page = 1;
  loadPanigation();
}

/**
 * 打开详情
 * @param data
 */
function handleDetail(data: KnowledgeLib.ListItem) {
  if (data.articleId) {
    router.push({ name: "libraryDetail", query: { articleId: data.articleId } });
  }
}
</script>

<style lang="less" scoped>
.listContainer {
  display: flex;
  margin: 0 -5px;
  .itemContainer {
    margin: 5px;
    border-radius: 6px;
    cursor: pointer;

    .imageWrapper {
      padding: 10px;
      .image {
        width: 240px;
        height: 160px;
        display: block;
      }
    }

    .titleWrapper {
      padding: 0 10px;
      line-height: 30px;
      font-size: 14px;
      color: #333;
    }

    .textWrapper {
      display: flex;
      padding: 0 10px;
      line-height: 30px;
      font-size: 12px;
      color: #666;
      .type {
        flex: 1;
        color: var(--primary-color);
      }
    }
  }
}
</style>
