<template>
  <el-upload
    action
    accept="image/jpeg,image/jpg,image/png"
    list-type="picture-card"
    :file-list="imageUrlList"
    :limit="limit || 1"
    :before-upload="beforeUpload"
    :http-request="onHttpRequest"
    :on-remove="handleRemove"
    :on-preview="handlePicturePreview"
    class="pictureCard"
  >
    <div>
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">点击上传</div>
    </div>

    <template #tip>
      <div class="tipContainer">
        <span class="tip">图片格式为jpeg、jpg、png</span>
        <span class="tip">最多上传{{ limit }}个</span>
        <span class="tip">图片限制&lt;{{ fileSize }}M</span>
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible" width="80%">
    <img class="w100-percent" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup="props">
import { ref, toRefs, watch } from "vue";
import md5 from "js-md5";
import OSS from "ali-oss";
import ossConfig from "@/utils/ossConfig";
import { ElMessage, UploadFile, UploadProps, UploadRawFile, UploadRequestOptions, UploadUserFile } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";

const props = withDefaults(
  defineProps<{
    imageUrls: Array<string>;
    limit?: number;
    fileSize?: number;
  }>(),
  { limit: 3, fileSize: 5 }
);

const emit = defineEmits(["update:imageUrls"]);

const { imageUrls, limit, fileSize } = toRefs(props);

const loading = ref<boolean>(false);

const imageUrlList = ref<Array<UploadUserFile>>([]);

const dialogImageUrl = ref<string>("");

const dialogVisible = ref<boolean>(false);

const dirName = "/platform_bridge/image/";

// 监听图片路径
watch(
  () => imageUrls.value,
  (value) => {
    imageUrlList.value = value.map((item) => ({ name: "", url: item }));
  },
  { immediate: true, deep: true }
);

/**
 * 上传检查
 * @param file
 */
const beforeUpload: UploadProps["beforeUpload"] = (file: UploadRawFile) => {
  if (imageUrlList.value.length >= limit.value) {
    ElMessage.warning(`最多上传${limit.value}张图片`);
    return false;
  }
  if (file.type !== "image/jpeg" && file.type !== "image/jpg" && file.type !== "image/png") {
    ElMessage.warning("文件格式应为jpeg、jpg、png");
    return false;
  }
  if (file.size / 1024 / 1024 > fileSize.value) {
    ElMessage.warning(`图片大小不能超过${fileSize.value}M`);
    return false;
  }
  return true;
};

/**
 * 自定义上传
 * @param param0
 */
const onHttpRequest: UploadProps["httpRequest"] = ({ file }: UploadRequestOptions) => {
  if (!ossConfig.OSSObj.accessKeyId) return Promise.reject("没有找到Oss配置！");
  const client = new OSS(ossConfig.OSSObj);
  const filename = md5(file.name + new Date().getTime());
  const storeAs = dirName + filename + "." + file.type.replace("image/", "");
  loading.value = true;
  return client
    .multipartUpload(storeAs, file, {
      parallel: 4,
      partSize: 1024 * 1024,
      progress: () => {}
    })
    .then((response) => {
      loading.value = false;
      if (response) {
        const imageUrl = ossConfig.url + response.name + "?x-oss-process=image/quality,q_60";
        const imageList = imageUrlList.value;
        imageList.push({ name: "", url: imageUrl });
        console.log(imageList.map((item) => item.url));
        emit(
          "update:imageUrls",
          imageList.map((item) => item.url)
        );
      } else {
        ElMessage.error({ message: "上传图片失败", duration: 2000 });
      }
    })
    .catch((err) => {
      console.log(err);
      loading.value = false;
      ElMessage.error({ message: "哦，出现了一个错误，请联系管理员", duration: 2000 });
    });
};

/**
 * 清除图片
 */
const handleRemove: UploadProps["onRemove"] = (file: UploadFile) => {
  emit(
    "update:imageUrls",
    imageUrlList.value.map((item) => item.url)
  );
};

/**
 * 预览图片
 */
const handlePicturePreview: UploadProps["onPreview"] = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};
</script>

<style lang="less" scoped>
.pictureCard {
  :deep(.el-upload-list--picture-card) {
    --el-upload-list-picture-card-size: 120px;
  }
  :deep(.el-upload--picture-card) {
    --el-upload-picture-card-size: 120px;
  }
}
.el-icon--upload {
  margin: 0px;
  font-size: 60px;
  margin-top: -10px;
  display: block;
}
.el-upload__text {
  color: var(--el-color-primary);
  font-style: normal;
  text-align: center;
}

.tipContainer {
  line-height: 24px;
  .tip {
    margin-right: 5px;
    font-size: 12px;
    color: #666;
  }
}
</style>
