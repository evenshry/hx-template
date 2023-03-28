<template>
  <el-select v-model="currentValue" placeholder="请选择" class="w300" allowClear filterable :disabled="disabled" @change="handleSelect">
    <el-option v-for="item in dataSource" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script setup lang="ts">
import { ref, toRefs, watch, onMounted } from "vue";

const props = defineProps<{
  value?: string;
  disabled?: boolean;
}>();

const emits = defineEmits(["update:value", "onChange"]);

const { value, disabled } = toRefs(props);

const dataSource = ref<Common.OptionItem[]>([]);

const currentValue = ref<string>("");

watch(
  () => value?.value,
  (val) => {
    if (val) {
      currentValue.value = val + "";
    } else {
      currentValue.value = "";
    }
  },
  { immediate: true }
);

onMounted(() => {
  loadData();
});

/**
 * 加载数据
 * @param groupCode
 */
async function loadData() {
  dataSource.value = [
    { label: "学习园地", value: "学习园地" },
    { label: "技术分享", value: "技术分享" }
  ];
}

/**
 * 选择路由
 * @param data
 */
async function handleSelect(value: string) {
  emits("update:value", value);
  const data = dataSource.value.find((item) => item.value == value);
  emits("onChange", { ...data });
}
</script>
