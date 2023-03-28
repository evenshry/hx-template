<template>
  <el-dialog
    :title="dialogData.articleId ? '编辑文章' : '发布文章'"
    width="1000px"
    top="20px"
    append-to-body
    destroy-on-close
    :model-value="visible"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      v-loading="dataLoading"
      :model="listParams"
      :rules="formRules"
      ref="listFormRef"
      label-width="120px"
      :disabled="listParams.status == 10"
    >
      <el-form-item label="文章标题：" prop="title">
        <el-input placeholder="请输入文章标题" :maxlength="20" v-model.trim="listParams.title" class="w300" show-word-limit />
      </el-form-item>

      <el-form-item label="文章分类：" prop="category">
        <CategorySelect v-model:value="listParams.category" />
      </el-form-item>

      <el-form-item label="文章封面：" prop="imageUrl">
        <el-input type="hidden" v-model="listParams.imageUrl" />
        <UploadPicture v-model:imageUrl="listParams.imageUrl" :disabled="listParams.status == 10" />
      </el-form-item>

      <el-form-item label="文章内容：" prop="content">
        <RichTextarea v-model:content="listParams.content" :height="400" :disabled="listParams.status == 10" />
      </el-form-item>

      <el-form-item label="是否置顶：" prop="top">
        <el-switch v-model="listParams.top" active-text="是" inactive-text="否" />
      </el-form-item>
    </el-form>

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>
        <el-button v-if="listParams.status == 20" type="primary" @click="handleSubmit" :loading="dataLoading"> 发 布 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup="props">
import { ref, toRefs, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import CategorySelect from "../components/CategorySelect.vue";
import { fetchKnowledgeLibDetail, saveKnowledgeLibInfo, updateKnowledgeLibInfo } from "../api";
import { useNormalData } from "@/utils/hooks";

const defaultParams: KnowledgeLib.Detail = {
  articleId: "",
  title: "",
  category: "",
  top: false,
  content: "",
  imageUrl: "",
  publishTime: "",
  status: 20
};

const props = defineProps<{
  visible: boolean;
  dialogData: KnowledgeLib.ListItem;
}>();

const emit = defineEmits(["update:visible", "onRefresh"]);

const { visible, dialogData } = toRefs(props);

const listFormRef = ref<FormInstance>();

const formRules = ref({
  title: [{ required: true, message: "请输入文章标题", trigger: ["change", "blur"] }],
  category: [{ required: true, message: "请选择文章分类", trigger: ["change", "blur"] }],
  // imageUrl: [{ required: true, message: "请上传文章封面", trigger: ["change", "blur"] }],
  content: [{ required: true, message: "请输入文章内容", trigger: ["change", "blur"] }],
});

// 加载详情
const {
  dataLoading,
  data: listParams,
  loadData: loadDetail
} = useNormalData<KnowledgeLib.Detail>(fetchKnowledgeLibDetail, dialogData, defaultParams, {
  success: (data: KnowledgeLib.Detail) => {
    // 
  }
});

// 监听窗口打开时 加载详情
watch(
  () => visible.value,
  (value) => {
    if (value && dialogData.value.articleId) {
      loadDetail();
    }
  },
  { immediate: true }
);

/**
 * 提交数据
 */
async function handleSubmit() {
  const data = listParams.value;
  const formRef = listFormRef.value;
  if (!formRef) return;
  formRef.validate(async (valid: boolean) => {
    if (valid) {
      try {
        dataLoading.value = true;
        let response = null;
        if (listParams.value.articleId) {
          response = await updateKnowledgeLibInfo(data);
        } else {
          response = await saveKnowledgeLibInfo(data);
        }
        ElMessage.success(response.msg || "保存成功！");
        handleSuccess();
      } finally {
        dataLoading.value = false;
      }
    }
  });
}

/**
 * 保存成功
 */
function handleSuccess() {
  handleClose();
  emit("onRefresh");
}

/**
 * 关闭
 */
function handleClose() {
  emit("update:visible", false);
  listFormRef.value && listFormRef.value.resetFields();
}
</script>
