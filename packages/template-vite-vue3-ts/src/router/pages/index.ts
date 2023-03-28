import { RouteComponent, RouteRecordRaw } from "vue-router";
import home from "./home";
import knowledge from "./knowledge";
import environment from "@/environment";

const routes: Array<RouteRecordRaw> = [
  {
    path: "pages",
    children: [...home, ...knowledge],
    meta: { title: environment.title || "" }
  },
  {
    path: "/pages/:catchAll(.*)",
    name: "pages404",
    meta: { title: "页面走丢了" },
    component: (): RouteComponent => {
      return import(/* webpackChunkName: "common_login" */ "@/views/common/home/404.vue");
    }
  }
];

export default routes;
