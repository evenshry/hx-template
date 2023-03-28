import { createRouter, createWebHashHistory, RouteComponent, RouteRecordRaw } from "vue-router";
import { usePiniaStore } from "@/store";
// @ts-ignore
import nprogress from "nprogress";
import pages from "./pages";
import environment from "@/environment";

/**
 * 路由集合
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "main",
    children: [...pages],
    component: (): RouteComponent => {
      return import(/* webpackChunkName: "main" */ "@/views/main.vue");
    }
  },
  {
    path: "/login",
    name: "login",
    meta: { title: "登录" },
    component: (): RouteComponent => {
      return import(/* webpackChunkName: "common_login" */ "@/views/common/login.vue");
    }
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    meta: { title: "页面走丢了" },
    component: (): RouteComponent => {
      return import(/* webpackChunkName: "common_login" */ "@/views/common/home/404.vue");
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
});

// --- beforeRouter --- //
router.beforeEach((to, _from, next) => {
  const { CommonStore, KeepAliveStore, SysRoleStore } = usePiniaStore();

  if (!to.path) {
    next("/login");
  }
  const token = CommonStore.getToken;
  const meta = to.meta || {};

  if (meta.keepAlive) {
    KeepAliveStore.setKeepAlive(to.name);
  }

  if (meta.canBack) {
    SysRoleStore.setCurrentPath(_from.path);
  } else {
    SysRoleStore.setCurrentPath(to.path);
  }

  nprogress.start();
  if (token) {
    if (meta.title) {
      window.document.title = environment.title + "|" + meta.title;
    }
    if (to.path === "/login") {
      next("/pages/home");
    } else if (to.path === "/") {
      next("/pages/home");
    } else {
      next();
    }
  } else {
    if (to.path === "/login" || to.path === "/findPassword" || to.path === "/register") {
      next();
    } else {
      next("/login");
    }
  }
});

// ---afterRouter --- //
router.afterEach((to, from) => {
  const { KeepAliveStore } = usePiniaStore();
  // 如果配置了目标缓存，即：目标页面不在目标缓存中，移除当前页面缓存
  if (from.meta.keepAlivePages) {
    if (from.meta.keepAlivePages.indexOf(to.name as string) == -1) {
      KeepAliveStore.removeKeepAlive(from.name);
    }
  }
  nprogress.done();
});

export default router;
