<template>
  <div class="flexContianer">
    <el-upload
      drag
      action
      accept="image/*"
      class="uploadBox"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="onHttpRequest"
      :style="{ width: width + 'px', height: height + 'px' }"
      :disabled="disabled"
    >
      <section class="uploadContainer" :class="{ disabled: disabled }">
        <transition name="fade">
          <div class="imageBox" v-if="imagePath">
            <img class="img" :src="imagePath" />
          </div>
        </transition>
        <section class="upload-default" :class="[imagePath ? 'hide' : '']">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将图片拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip">支持jpg/jpeg/png文件，且不超过5MB</div>
        </section>
      </section>
    </el-upload>

    <el-button v-if="imagePath && !disabled" class="btnClear" :icon="Delete" type="danger" @click="handleClearImage" circle />
  </div>
</template>

<script lang="ts" setup="props">
import { ref, toRefs, watch } from "vue";
import md5 from "js-md5";
import OSS from "ali-oss";
import ossConfig from "@/utils/ossConfig";
import { ElMessage, UploadProps, UploadRawFile, UploadRequestOptions } from "element-plus";
import { Delete, UploadFilled } from "@element-plus/icons-vue";

const props = withDefaults(
  defineProps<{
    imageUrl: string;
    width?: number;
    height?: number;
    disabled?: boolean;
  }>(),
  {
    imageUrl: () => "",
    width: () => 240,
    height: () => 120,
    disabled: () => false
  }
);

const { imageUrl, width, height } = toRefs(props);

const loading = ref<boolean>(false);

const imagePath = ref<string>("");

const emit = defineEmits(["update:imageUrl"]);

const dirName = "/platform_bridge/image/";

// 监听图片路径
watch(
  () => imageUrl.value,
  (value) => {
    if (value && value.indexOf("http") > -1) {
      imagePath.value = value;
    } else {
      imagePath.value = "";
    }
  },
  { immediate: true }
);

/**
 * 上传检查
 * @param file
 */
const beforeUpload: UploadProps["beforeUpload"] = (file: UploadRawFile) => {
  if (file.type !== "image/jpeg" && file.type !== "image/jpg" && file.type !== "image/png") {
    ElMessage.warning("文件格式应为jpeg、jpg、png");
    return false;
  }
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.warning("图片大小不能超过5M");
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
        imagePath.value = ossConfig.url + response.name + "?x-oss-process=image/quality,q_60";
        emit("update:imageUrl", imagePath);
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
function handleClearImage() {
  emit("update:imageUrl", "");
}
</script>

<style lang="less" scoped>
.flexContianer {
  position: relative;

  .btnClear {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
  }
}
.uploadBox {
  :deep(.el-upload) {
    width: 100%;
    height: 100%;
    .el-upload-dragger {
      padding: 0;
      width: 100%;
      height: 100%;
    }
  }
}
.uploadContainer {
  position: relative;
  background-color: #fff;
  width: 100%;
  height: 100%;

  .imageBox {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .img {
      display: block;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .upload-default {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &.hide {
      z-index: -1;
      opacity: 0;
    }
  }

  &:hover {
    .upload-default {
      z-index: 1;
      background-color: rgba(255, 255, 255, 0.8);
      opacity: 1;
    }
  }

  &.disabled {
    &:hover {
      .upload-default {
        z-index: -1;
        opacity: 0;
      }
    }
  }

  .el-icon--upload {
    margin: 0px;
    font-size: 60px;
    margin-top: -10px;
  }
  .el-upload__text {
    line-height: 24px;
    font-size: 12px;
  }
  .el-upload__tip {
    margin-top: 0px;
    line-height: 20px;
    font-size: 12px;
  }
}
</style>
