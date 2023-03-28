<template>
  <div class="flexContianer">
    <el-upload
      drag
      action
      accept="video/mp4"
      class="uploadBox"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="onHttpRequest"
      :style="{ width: width + 'px', height: height + 'px' }"
    >
      <section class="uploadContainer">
        <section class="upload-default">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将视频拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip">支持mp4文件，且不超过100MB</div>
        </section>
      </section>
    </el-upload>

    <el-button v-if="videoPath" class="btnClear" :icon="Delete" type="danger" @click="handleClearImage" circle />

    <div class="videoContainer" :style="{ width: width + 'px', height: height + 'px' }">
      <video v-if="videoPath" :src="videoPath" :style="{ width: width + 'px', height: height + 'px' }" controls>
        您的浏览器不支持视频播放
      </video>
      <div class="videoDefault" v-else>
        <el-icon class="icon"><video-play /></el-icon>
        <div class="text">视频预览</div>
      </div>

      <div class="progress" v-if="percentage > 0 && !videoPath">
        <el-progress type="circle" text-inside :stroke-width="10" :percentage="Number(percentage) > 100 ? 100 : Number(percentage)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup="props">
import { ref, toRefs, watch } from "vue";
import md5 from "js-md5";
import OSS from "ali-oss";
import ossConfig from "@/utils/ossConfig";
import { ElMessage, UploadProps, UploadRawFile, UploadRequestOptions } from "element-plus";
import { Delete, UploadFilled, VideoPlay } from "@element-plus/icons-vue";

const props = withDefaults(
  defineProps<{
    videoUrl: string | null;
    width?: number;
    height?: number;
  }>(),
  {
    videoUrl: () => "",
    width: () => 240,
    height: () => 120
  }
);

const { videoUrl, width, height } = toRefs(props);

const loading = ref<boolean>(false);

const videoPath = ref<string>("");

const percentage = ref<number>(0);

const emit = defineEmits(["update:videoUrl"]);

const dirName = "/platform_bridge/video/";

// 监听图片路径
watch(
  () => videoUrl.value,
  (value) => {
    videoPath.value = value || "";
  },
  { immediate: true }
);

/**
 * 上传检查
 * @param file
 */
const beforeUpload: UploadProps["beforeUpload"] = (file: UploadRawFile) => {
  if (file.type !== "video/mp4") {
    ElMessage.warning("文件格式应为mp4");
    return false;
  }
  if (file.size / 1024 / 1024 > 100) {
    ElMessage.warning("图片大小不能超过100M");
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
  const storeAs = dirName + filename + "." + file.type.replace("video/", "");
  const headerInfo = randomString(6) + "_" + new Date().getTime() + "." + file.name.split(".").pop();
  loading.value = true;
  percentage.value = 1;
  return client
    .multipartUpload(storeAs, file, {
      parallel: 4,
      partSize: 1024 * 1024,
      //这个地方需要设置，不然视频无法用浏览器的方式下载，只能播放。
      headers: { "Content-Disposition": headerInfo },
      progress: (progress: number) => {
        const temp = progress * 100;
        percentage.value = temp < 1 ? 1 : temp;
      }
    })
    .then((response) => {
      percentage.value = 0;
      loading.value = false;
      if (response) {
        videoPath.value = ossConfig.url + response.name;
        emit("update:videoUrl", videoPath);
      } else {
        ElMessage.error({ message: "上传视频失败", duration: 2000 });
      }
    })
    .catch((err) => {
      console.log(err);
      percentage.value = 0;
      loading.value = false;
      ElMessage.error({ message: "哦，出现了一个错误，请联系管理员", duration: 2000 });
    });
};

/**
 * 清除图片
 */
function handleClearImage() {
  emit("update:videoUrl", "");
}

/**
 * 获取随机字符串
 */
function randomString(len: number) {
  len = len || 32;
  let chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678",
    maxPos = chars.length,
    pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
</script>

<style lang="less" scoped>
.flexContianer {
  display: flex;
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
    }
  }

  &:hover {
    .upload-default {
      z-index: 1;
      background-color: rgba(255, 255, 255, 0.8);
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

.videoContainer {
  margin-left: 10px;
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  video {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
  .progress {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }
}
.videoDefault {
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    color: #999;
    font-size: 40px;
    line-height: 60px;
  }
  .text {
    color: #666;
    font-size: 14px;
  }
}
</style>
