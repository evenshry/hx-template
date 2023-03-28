<template>
  <div class="uploadWrapper">
    <el-upload
      v-show="!disabled"
      action
      :accept="accept"
      list-type="text"
      v-model:file-list="fileUrlList"
      :limit="limit"
      :beforeUpload="beforeUpload"
      :http-request="onHttpRequest"
      :on-remove="handleRemove"
      :disabled="disabled"
    >
      <el-button type="default" :disabled="disabled">
        <el-icon class="icon"><upload-filled /></el-icon>点击上传
      </el-button>
      <template #tip>
        <div class="tipContainer">
          <span class="tip">仅支持扩展名：{{ accept }}</span>
          <span class="tip">最多上传{{ limit }}个</span>
          <span class="tip">文件限制&lt;{{ fileSize }}M</span>
        </div>
      </template>
    </el-upload>
    <a class="link" v-if="disabled && !Array.isArray(fileUrls)" :href="fileUrls" target="_blank">{{ fileUrls }}</a>
  </div>
</template>

<script lang="ts" setup="props">
import { ref, toRefs, watch } from "vue";
import { ElMessage, UploadFile, UploadProps, UploadRawFile, UploadRequestOptions, UploadUserFile } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import ossConfig from "@/utils/ossConfig";
import OSS from "ali-oss";
import moment from "moment";

const props = withDefaults(
  defineProps<{
    fileUrls?: string | string[];
    files?: Array<UploadUserFile>;
    limit?: number;
    accept?: string;
    disabled?: boolean;
    fileSize?: number;
  }>(),
  { accept: "*", disabled: false, fileSize: 100, limit: 1 }
);

const { fileUrls, files, limit, accept, disabled, fileSize } = toRefs(props);

const loading = ref<boolean>(false);

const fileUrlList = ref<Array<UploadUserFile>>([]);

const emit = defineEmits(["update:fileUrls", "update:files"]);

const dirName = "/platform_bridge/file/";

// 监听图片路径
watch(
  () => fileUrls?.value,
  (value) => {
    if (value && Array.isArray(value)) {
      fileUrlList.value = value.map((item, index) => {
        const temp = item.split("/");
        return { name: temp[temp.length - 1], url: item, uid: index, status: "success" };
      });
    } else if (value && !Array.isArray(value)) {
      fileUrlList.value = [{ name: value?.split("/")[value.split("/").length - 1], url: value, uid: 1, status: "success" }];
    } else {
      fileUrlList.value = [];
    }
  },
  { immediate: true, deep: true }
);

/**
 * 上传检查
 * @param file
 */
const beforeUpload: UploadProps["beforeUpload"] = (file: UploadRawFile) => {
  if (file.size / 1024 / 1024 > fileSize.value) {
    ElMessage.warning("文件大小不能超过100M");
    return false;
  }
  return true;
};

/**
 * 自定义上传
 * @param param0
 */
const onHttpRequest: UploadProps["httpRequest"] = ({ file, onProgress }: UploadRequestOptions) => {
  if (!ossConfig.OSSObj.accessKeyId) return Promise.reject("没有找到Oss配置！");
  const client = new OSS(ossConfig.OSSObj);
  const prefix = moment().format("YYYYMMDDHHmmssSSSS");
  // const storeAs = dirName + prefix+ "." + file.name.split(".")[1];
  const fileName = prefix + "_" + file.name;
  loading.value = true;
  return client
    .multipartUpload(dirName + fileName, file, {
      parallel: 4,
      partSize: 1024 * 1024,
      progress: (percent: number) => {
        const event: any = { percent };
        onProgress(event);
      }
    })
    .then((response) => {
      loading.value = false;
      if (response) {
        const fileUrl = ossConfig.url + response.name;
        fileUrlList.value.push({ name: fileName, url: fileUrl });
        const imageList = fileUrlList.value;
        if (limit.value === 1) {
          emit("update:fileUrls", fileUrl);
        } else {
          emit(
            "update:fileUrls",
            imageList.map((item) => item.url)
          );
        }
        console.log(fileUrl);
      } else {
        ElMessage.error({ message: "文件上传失败", duration: 2000 });
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
  emit("update:files", fileUrlList.value);
  if (!Array.isArray(fileUrls?.value)) {
    emit(
      "update:fileUrls",
      fileUrlList.value.map((item) => item.url)
    );
  } else {
    emit("update:fileUrls", "");
  }
};

/**
 * 移除文件
 * @param url
 */
function removeFile(url: string) {
  const client = new OSS(ossConfig.OSSObj);
  const name = url.replace(ossConfig.url, "");
  client.delete(name);
}

defineExpose({ removeFile });
</script>

<style lang="less" scoped>
.uploadWrapper {
  width: 100%;
  .icon {
    font-size: 18px;
    margin-right: 5px;
  }
  .tipContainer {
    line-height: 24px;
    .tip {
      margin-right: 5px;
      font-size: 12px;
      color: #666;
    }
  }
}
.link {
  color: #409eff;
}
</style>
