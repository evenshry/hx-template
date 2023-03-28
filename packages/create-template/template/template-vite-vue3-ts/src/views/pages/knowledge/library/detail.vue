<template>
  <div class="pageWrapper box-shadow" v-loading="dataLoading">
    <div class="titleWrapper">
      <div class="title">{{ detail.title || "-" }}</div>
      <el-icon class="star" @click="handleFavor"> <StarFilled v-if="detail.collect" /><Star v-else /> </el-icon>
    </div>

    <div class="textWrapper">
      <div class="type">{{ detail.category }}</div>
      <div class="date">{{ detail.publishTime }}</div>
    </div>

    <div class="imageWrapper" v-if="detail.imageUrl">
      <el-image :src="detail.imageUrl" class="image" fit="cover" />
    </div>

    <div class="content" v-html="detail.content" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({ name: "libraryDetail" });
</script>

<script lang="ts" setup="props">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Star } from "@element-plus/icons-vue";
import { useNormalData } from "@/utils/hooks";
import { fetchKnowledgeLibDetail } from "./api";
import { ElMessage } from "element-plus";

const defaultParams: KnowledgeLib.Detail = {
  articleId: "",
  title: "",
  category: "",
  top: false,
  collect: false,
  content: "",
  publishTime: "",
  status: 0
};

const route = useRoute();

const fetchParams = ref<KnowledgeLib.FetchParams>({ articleId: "" });

// 加载详情
const {
  dataLoading,
  data: detail,
  loadData: loadDetail
} = useNormalData<KnowledgeLib.Detail>(fetchKnowledgeLibDetail, fetchParams, defaultParams, {
  success: (data: KnowledgeLib.Detail) => {
    //
  }
});

onMounted(() => {
  if (route.query.articleId) {
    fetchParams.value.articleId = route.query.articleId as string;
    loadDetail();
  }
});

/**
 * 收藏
 */
async function handleFavor() {
  if (detail.value.articleId) {
    try {
      dataLoading.value = true;
      detail.value.collect = !detail.value.collect;
      ElMessage.success("操作成功！");
    } finally {
      dataLoading.value = false;
    }
  } else {
    ElMessage.warning("没有找到文章信息！");
  }
}
</script>

<style lang="less" scoped>
.pageWrapper {
  padding: 10px;
  .imageWrapper {
    padding: 10px;
    width: 600px;
    margin: auto;
    .image {
      display: block;
    }
  }

  .titleWrapper {
    padding: 0 10px;
    display: flex;
    align-items: center;
    .title {
      flex: 1;
      line-height: 48px;
      font-size: 18px;
      color: #333;
    }
    .star {
      font-size: 30px;
      color: #faa60a;
      cursor: pointer;
    }
  }

  .textWrapper {
    display: flex;
    padding: 10px;
    line-height: 30px;
    font-size: 14px;
    color: #666;
    .type {
      color: var(--primary-color);
      margin-right: 20px;
    }
  }

  .content {
    margin: 20px;
  }

  .fileWrapper {
    margin: 10px;
    display: flex;
    .label {
      line-height: 30px;
      font-size: 14px;
      color: #333;
    }
    .value {
      font-size: 14px;
      color: var(--primary-color);
      a {
        line-height: 30px;
        text-decoration: none;
      }
    }
  }
}
</style>
