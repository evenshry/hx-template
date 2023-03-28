<template>
  <el-popconfirm :title="title" :confirm-button-text="okText" :cancel-button-text="cancelText" @confirm="confirm" @cancel="cancel">
    <template #reference>
      <el-button :link="link" :type="type" :size="size" :disabled="disabled">
        <slot></slot>
      </el-button>
    </template>
  </el-popconfirm>
</template>

<script lang="ts" setup="props">
defineProps({
  title: { type: String, default: "确定要执行该操作吗？" },
  okText: { type: String, default: "确定" },
  cancelText: { type: String, default: "取消" },
  type: { type: String, default: "primary" },
  size: { type: String, default: "default" },
  disabled: { type: Boolean, default: false },
  link: { type: Boolean, default: true }
});

const emits = defineEmits(["confirmed", "canceled"]);

function confirm() {
  emits("confirmed");
}

function cancel() {
  emits("canceled");
}
</script>

<style lang="less" scoped></style>
