import { RouteComponent, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "home",
    name: "home",
    meta: { title: "首页" },
    component: (): RouteComponent => {
      return import(/* webpackChunkName: "pages_home" */ "@/views/common/home/index.vue");
    }
  }
];

export default routes;
