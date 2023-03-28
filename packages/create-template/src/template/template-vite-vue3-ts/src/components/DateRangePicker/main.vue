<template>
  <el-date-picker
    v-model="dataRange"
    :type="combineType"
    :start-placeholder="placeholder[0]"
    :end-placeholder="placeholder[1]"
    :range-separator="placeholder[2]"
    :format="combineFormat"
    :value-format="combineFormat"
    :clearable="clearable"
    :disabled-date="disabledDate"
    @change="handleChange"
  />
</template>
<script setup lang="ts">
import { computed, ref, toRefs, watch } from "vue";
import moment from "moment";

const props = defineProps({
  startTime: {
    type: String,
    default: ""
  },
  endTime: {
    type: String,
    default: ""
  },
  showTimeRange: {
    type: Boolean,
    default: () => false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  format: {
    type: String,
    default: "YYYY-MM-DD"
  },
  timeFormat: {
    type: String,
    default: "HH:mm:ss"
  },
  placeholder: {
    type: Array,
    default: () => ["开始时间", "结束时间", "至"]
  },
  disabledDate: {
    type: Function,
    default: () => {}
  }
});

const emit = defineEmits(["update:startTime", "update:endTime"]);

const { startTime, endTime, showTimeRange, format, timeFormat, placeholder, disabledDate } = toRefs(props);

const combineType = computed(() => {
  return showTimeRange.value ? "datetimerange" : "daterange";
});

const combineFormat = computed(() => {
  return showTimeRange.value ? `${format.value} ${timeFormat.value}` : format.value;
});

const dataRange = ref<[string, string]>();

watch(
  () => startTime.value,
  (value) => {
    let startValue = "";
    if (value) {
      startValue = moment(value).format(combineFormat.value);
    }
    let endValue = "";
    if (endTime.value) {
      endValue = moment(endTime.value).format(combineFormat.value);
    }
    dataRange.value = [startValue, endValue];
  },
  { immediate: true }
);

/**
 * 抛出数据
 */
function handleChange(value: string[]) {
  emit("update:startTime", value ? value[0] : "");
  emit("update:endTime", value ? value[1] : "");
}
</script>
