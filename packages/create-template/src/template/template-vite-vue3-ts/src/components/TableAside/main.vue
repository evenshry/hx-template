<template>
  <div class="tableRow" :class="{ slide: switchType == 'slide', fade: switchType == 'fade' }">
    <div class="tableLeft" :class="{ fixed: visibleMain }">
      <slot></slot>
    </div>

    <div class="tableFill" v-if="visibleMain">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup="props">
import { computed, toRefs } from "vue";

interface Props {
  visibleMain?: boolean;
  switchType?: string;
  leftRatio?: number;
}

const props = withDefaults(defineProps<Props>(), {
  visibleMain: () => false,
  switchType: () => "slide", // slide | fade
  leftRatio: () => 5
});

const { visibleMain, leftRatio } = toRefs(props);

const leftRatioCpu = computed(() => {
  return visibleMain.value ? leftRatio.value : 10;
});
</script>

<style lang="scss" scoped>
.tableRow {
  display: flex;
  // margin-top: -10px;

  .tableLeft {
    width: 100%;
    transition: all ease-in-out 0.3s;
  }
  .tableFill {
    width: 100%;
    transition: all ease-in-out 0.3s;
  }

  &.slide {
    .tableLeft {
      width: calc(v-bind(leftRatioCpu) * 10%);
      &.fixed {
        margin-right: 10px;
      }
    }
    .tableFill {
      width: calc((10 - v-bind(leftRatioCpu)) * 10%);
    }
  }
  &.fade {
    .tableLeft {
      width: 100%;
      &.fixed {
        width: 0;
        display: none;
      }
    }
    .tableFill {
      width: 100%;
    }
  }
}
</style>
