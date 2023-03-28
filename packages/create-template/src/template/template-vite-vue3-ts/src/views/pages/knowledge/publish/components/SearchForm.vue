<template>
  <div class="topContainer">
    <div class="before">
      <slot name="before"></slot>
    </div>
    <el-form inline :model="listParams" class="formContainer" label-width="0px">
      <el-form-item>
        <el-input
          v-model="listParams[inputKey]"
          :prefix-icon="Search"
          :placeholder="placeholder"
          :class="inputClass"
          @keyup.enter="onSubmit"
          clearable
        />
      </el-form-item>

      <el-form-item class="mgl10">
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="after">
      <slot name="after"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup="props">
import { ref, toRefs, watch } from "vue";
import { Search } from "@element-plus/icons-vue";

const props = withDefaults(
  defineProps<{
    params: Common.FetchParams;
    inputKey: string;
    placeholder?: string;
    inputClass?: string;
  }>(),
  {
    placeholder: () => "模糊搜索",
    inputClass: () => "w300"
  }
);

const emits = defineEmits(["onSearch"]);

const { params, inputKey, placeholder } = toRefs(props);

const defaultParams: Common.FetchParams = {};

const listParams = ref<Common.FetchParams>({});

// 监听参数变化
watch(
  () => inputKey.value,
  (value) => {
    if (value) {
      defaultParams[value] = "";
    }
  },
  { deep: true, immediate: true }
);

// 监听参数变化
watch(
  () => params.value,
  (value) => {
    if (value) {
      listParams.value = { ...defaultParams, ...listParams.value, ...value };
    }
  },
  { deep: true, immediate: true }
);

/**
 * 提交参数
 */
function onSubmit() {
  emits("onSearch", { ...listParams.value });
}
</script>

<style lang="less" scoped>
.topContainer {
  display: flex;
  margin-bottom: 20px;
  .before {
    flex: 1;
    position: relative;
  }
  .after {
    position: relative;
  }
}
.formContainer {
  :deep(.el-form-item) {
    margin-right: 0px;
    margin-bottom: 0px;
  }
}
</style>
