<template>
  <el-cascader
    ref="cascader"
    v-model="cascaderValue"
    :props="cascaderProps"
    :class="className || 'w300'"
    placeholder="请选择区域"
    @change="handleChange"
    :disabled="disabled"
  />
</template>

<script lang="ts" setup="props">
import { ref, toRefs, watch } from "vue";
import { fetchAreaList } from "./api";

const props = defineProps<{
  values: Array<string>;
  className?: string;
  disabled?: boolean;
  checkStrictly?: boolean;
}>();

const emit = defineEmits(["input", "change"]);

const { values, checkStrictly } = toRefs(props);

const cascaderValue = ref([] as Array<string>);

const cascader = ref(null);

const cascaderProps = ref({
  lazy: true,
  value: "code",
  label: "label",
  checkStrictly: checkStrictly?.value || false,
  lazyLoad: (node: any, resolve: Function) => {
    const { level } = node;
    if (node.root) {
      getAreaList({ level }, resolve);
    } else {
      getAreaList({ level, code: node.value }, resolve);
    }
  }
});

// 监听数据
watch(
  () => values.value,
  (newValue) => {
    cascaderValue.value = [...newValue];
  },
  { deep: true, immediate: true }
);

/**
 * 获取区域数据
 * @param params
 */
function getAreaList(params: AreaCascader.Params, resolve: Function) {
  fetchAreaList(params).then((response) => {
    const data = response.data || [];
    const result = data.map((item) => ({
      ...item,
      leaf: !item.hasNext
    }));
    resolve(result);
  });
}

/**
 * 选择选项
 */
function handleChange(data: Array<string>) {
  emit("input", data);
  if (cascader && cascader.value) {
    // @ts-ignore
    const nodes = cascader.value.getCheckedNodes();
    emit("change", {
      values: data,
      labels: nodes[0].pathLabels
    });
  }
}
</script>
