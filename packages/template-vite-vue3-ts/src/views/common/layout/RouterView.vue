<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in" appear>
      <keep-alive :include="keepAliveComponents" :max="10">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { usePiniaStore } from "@/store";

const { KeepAliveStore } = usePiniaStore();

const keepAliveComponents = KeepAliveStore.getKeepAliveComponents;
</script>
