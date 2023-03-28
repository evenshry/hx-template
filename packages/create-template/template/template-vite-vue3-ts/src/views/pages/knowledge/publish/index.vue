<template>
  <div class="pageWrapper">
    <SearchForm :params="listParams" @on-search="handleSearch" input-key="title" placeholder="请输入文章名称">
      <template #before>
        <el-button type="primary" @click="handleAppend()">发布</el-button>
      </template>
    </SearchForm>

    <TableContainer
      :loading="dataLoading"
      :pageInfo="panigationData"
      @page-current-change="handlePageChange"
      @page-size-change="handleSizeChange"
    >
      <template v-slot:default>
        <el-table border :data="panigationData.entries">
          <TableRowIndex :page-index="panigationData.page" :page-size="panigationData.pageLimit" />

          <el-table-column align="center" label="文章名称" prop="title" />
          <el-table-column align="center" label="文章分类" prop="category" />
          <el-table-column align="center" label="发布日期" prop="publishTime" />

          <el-table-column align="center" label="状态" prop="status">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.status == 10">已上架</el-tag>
              <el-tag type="danger" v-else>已下架</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="200">
            <template #default="scope">
              <el-button link type="primary" @click="handleDetail(scope.row)">查看详情</el-button>
              <el-button link type="danger" v-if="scope.row.status == 10" @click="handleUpdate(scope.row)">下架</el-button>
              <template v-else>
                <el-button link type="success" @click="handleUpdate(scope.row)">上架</el-button>
                <ConfirmButton link type="danger" title="确定要删除吗？" @confirmed="handleRemove(scope.row)">删除</ConfirmButton>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TableContainer>

    <!-- 编辑文章 -->
    <SubmitForm v-model:visible="visibleDetail" :dialog-data="dialogUpdateRole" @on-refresh="handleSearch" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import SearchForm from "./components/SearchForm.vue";
import SubmitForm from "./dialog/SubmitForm.vue";
import { useMyState, usePagination } from "@/utils/hooks";
import { fetchKnowledgeLibList, putOnShelvesKnowledgeLib, getOffShelvesKnowledgeLib, deleteKnowledgeLibInfo } from "./api";

const defaultParams: KnowledgeLib.FetchParams = {
  title: "",
  page: 1,
  pageLimit: 20
};

const [visibleDetail, setVisibleDetail] = useMyState<boolean>(false);

const dialogUpdateRole = ref<KnowledgeLib.ListItem>({});

const listParams = ref(defaultParams);

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
 * 打开新增弹窗
 */
function handleAppend() {
  dialogUpdateRole.value = {};
  setVisibleDetail(true);
}

/**
 * 打开详情
 * @param data
 */
function handleDetail(data: KnowledgeLib.ListItem) {
  if (data.articleId) {
    dialogUpdateRole.value = { articleId: data.articleId };
    setVisibleDetail(true);
  }
}

/**
 * 更新状态
 */
async function handleUpdate(data: KnowledgeLib.ListItem) {
  if (data.articleId) {
    try {
      dataLoading.value = true;
      let response = null;
      if (data.status == 10) {
        response = await getOffShelvesKnowledgeLib({ articleId: data.articleId });
      } else {
        response = await putOnShelvesKnowledgeLib({ articleId: data.articleId });
      }
      ElMessage.success(response?.msg || "操作成功！");
      loadPanigation();
    } finally {
      dataLoading.value = false;
    }
  }
}

/**
 * 执行删除
 */
async function handleRemove(data: KnowledgeLib.ListItem) {
  if (data.articleId) {
    try {
      dataLoading.value = true;
      const response = await deleteKnowledgeLibInfo({ articleId: data.articleId });
      ElMessage.success(response.msg || "删除成功！");
      loadPanigation();
    } finally {
      dataLoading.value = false;
    }
  }
}
</script>
