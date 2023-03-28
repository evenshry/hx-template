<template>
  <div class="pageWrapper">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="itemCard" header="知识库动态" v-loading="articleLoading">
          <div class="listContainer" v-if="articleData.entries && articleData.entries.length > 0">
            <div
              class="itemContainer box-shadow flex"
              v-for="(item, index) in articleData.entries"
              @click="handleArticleDetail(item)"
              :key="index"
            >
              <div class="imageWrapper" v-if="item.imageUrl">
                <el-image :src="item.imageUrl" class="image" fit="cover" />
              </div>

              <div class="infoWrapper">
                <div class="titleWrapper">{{ item.title }}</div>

                <div class="textWrapper">
                  <div class="type">{{ item.category }}</div>
                  <div class="date">{{ item.publishTime }}</div>
                </div>
              </div>
              <el-icon class="iconRight"><ArrowRight /></el-icon>
            </div>
          </div>

          <el-empty v-else :image-size="100" description="暂无文章" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="itemCard">
          <div class="qrcodeContainer">
            <el-image :src="ImageQrCode" class="image" fit="contain" />
            <div class="text">扫二维码下载{{ env.title }}App</div>
            <div class="text">
              <a href="#" download target="_blank">下载二维码</a>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMyState, usePagination } from "@/utils/hooks";
import { fetchKnowledgeLibList } from "@/views/pages/knowledge/library/api";
import env from "@/environment";

import { ImageQrCode } from "@/mock/image";

const router = useRouter();

const listParams = ref({ startTime: "", endTime: "" });

// 查询文章参数
const [articleParams] = useMyState<KnowledgeLib.FetchParams>({ page: 1, pageLimit: 10 });
// 查询文章列表
const {
  dataLoading: articleLoading,
  panigationData: articleData,
  loadPanigation: loadArticleData
} = usePagination<KnowledgeLib.ListItem>(fetchKnowledgeLibList, articleParams);

onMounted(() => {
  loadArticleData();
});

/**
 * 打开详情
 * @param data
 */
function handleArticleDetail(data: KnowledgeLib.ListItem) {
  if (data.articleId) {
    router.push({ name: "libraryDetail", query: { articleId: data.articleId } });
  }
}
</script>

<style lang="less" scoped>
.pageWrapper {
  position: relative;
  .itemCard {
    position: relative;
    min-height: 700px;
    margin-bottom: 10px;
    .qrcodeContainer {
      display: flex;
      flex-direction: column;
      .image {
        width: 300px;
        height: 300px;
        display: block;
        margin: 30px auto;
      }
      .text {
        font-size: 14px;
        color: #333;
        margin-top: 30px;
        text-align: center;
        a {
          color: var(--primary-color);
          text-decoration: none;
        }
      }
    }
  }
}

.listContainer {
  margin: -5px;
  .itemContainer {
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 10px;
    cursor: pointer;
    &.flex {
      display: flex;
      align-items: center;
    }
    &.approval {
      background-color: #f5f7fa;
    }

    .imageWrapper {
      .image {
        width: 60px;
        height: 60px;
        display: block;
      }
    }

    .infoWrapper {
      flex: 1;
      margin-left: 10px;
      .titleWrapper {
        line-height: 30px;
        font-size: 13px;
        color: #000;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }

      .textWrapper {
        display: flex;
        margin-top: 10px;
        line-height: 24px;
        font-size: 12px;
        color: #666;
        .type {
          margin-right: 10px;
          color: var(--primary-color);
        }
      }
    }
    .rowWrapper {
      display: flex;
      align-items: center;
      line-height: 24px;
      font-size: 12px;

      .label {
        flex: 1;
        color: #666;
      }
      .date {
        color: #666;
      }
      &.titleWrapper {
        color: #000;
        font-size: 14px;
        line-height: 24px;
        border-bottom: 1px solid #e6e8eb;
        padding-bottom: 8px;
        margin-bottom: 8px;
        .iconfont {
          font-size: 13px;
          margin-right: 5px;
        }
        .label {
          color: #000;
        }
      }
    }
    .iconRight {
      font-size: 14px;
      margin-left: 5px;
      color: #666;
    }
  }
}
</style>
