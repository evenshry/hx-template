<template>
  <div v-if="!disabled" class="richTextWrapper">
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" class="toolbar" />
    <Editor
      class="content"
      :style="{ height: (height || 300) + 'px' }"
      v-model="_content"
      :mode="mode"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
    />
  </div>
  <div v-else>
    <span class="content" v-html="_content"></span>
  </div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css";
import { onBeforeUnmount, toRefs, ref, shallowRef, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { IEditorConfig } from "@wangeditor/editor";
import { ElMessage } from "element-plus";
import ossConfig from "@/utils/ossConfig";
import OSS from "ali-oss";
import md5 from "js-md5";

//传参
const emit = defineEmits(["update:content"]);
//传参
const props = defineProps<{
  content: string;
  disabled?: Boolean;
  height?: number;
}>();

const toolbarConfig = {};

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const mode = "defalut";

const { content, disabled, height } = toRefs(props);

const _content = ref<string>("");

const dirName = "/platform_cp/";

watch(
  () => content.value,
  (value) => {
    if (value) {
      _content.value = value;
    }
  },
  { immediate: true }
);

watch(_content, (value) => {
  if (value) {
    emit("update:content", value.replace(/<p><br><\/p>/g, ""));
  }
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor;
};

// 初始化 MENU_CONF 属性
const editorConfig: Partial<IEditorConfig> = {
  MENU_CONF: {
    uploadImage: {
      customUpload(file: File, insertFn: any) {
        if (!ossConfig.OSSObj.accessKeyId) return Promise.reject("没有找到Oss配置！");
        const client = new OSS(ossConfig.OSSObj);
        const filename = md5(file.name + new Date().getTime());
        const storeAs = dirName + "rich_image/" + filename + "." + file.type.replace("image/", "");
        client
          .multipartUpload(storeAs, file, {
            // 设置并发上传的分片数量。
            parallel: 4,
            // 设置分片大小。默认值为1 MB，最小值为100 KB。
            partSize: 1024 * 1024
          })
          .then((response) => {
            insertFn(ossConfig.url + response.name);
          })
          .catch((err) => {
            console.log(err);
            ElMessage.error({ message: "哦，出现了一个错误，请联系管理员", duration: 2000 });
          });
      }
    },
    uploadVideo: {
      customUpload(file: File, insertFn: any) {
        if (!ossConfig.OSSObj.accessKeyId) return Promise.reject("没有找到Oss配置！");
        const client = new OSS(ossConfig.OSSObj);
        const filename = md5(file.name + new Date().getTime());
        const storeAs = dirName + "rich_video/" + filename + "." + file.type.replace("video/", "");
        client
          .multipartUpload(storeAs, file, {
            // 设置并发上传的分片数量。
            parallel: 4,
            // 设置分片大小。默认值为1 MB，最小值为100 KB。
            partSize: 1024 * 1024
          })
          .then((response) => {
            insertFn(ossConfig.url + response.name);
          })
          .catch((err) => {
            console.log(err);
            ElMessage.error({ message: "哦，出现了一个错误，请联系管理员", duration: 2000 });
          });
      }
    }
  },
  placeholder: "请输入内容..."
};
</script>

<style lang="less">
.richTextWrapper {
  border: 1px solid #eee;
  .toolbar {
    border-bottom: 1px solid #ccc;
  }

  .content {
    overflow-y: hidden;
  }
}
</style>
