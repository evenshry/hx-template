import { RouteComponent, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "knowledge",
    meta: { title: "知识库" },
    children: [
      {
        path: "library/list",
        name: "libraryList",
        meta: { title: "知识库", keepAlive: true, keepAlivePages: ["libraryDetail"] },
        component: (): RouteComponent => {
          return import(/* webpackChunkName: "pages_knowledge_library" */ "@/views/pages/knowledge/library/index.vue");
        }
      },
      {
        path: "library/detail",
        name: "libraryDetail",
        meta: { title: "文章详情", canBack: true },
        component: (): RouteComponent => {
          return import(/* webpackChunkName: "pages_knowledge_library_detail" */ "@/views/pages/knowledge/library/detail.vue");
        }
      },
      {
        path: "publish",
        name: "publish",
        meta: { title: "发布" },
        component: (): RouteComponent => {
          return import(/* webpackChunkName: "pages_knowledge_publish" */ "@/views/pages/knowledge/publish/index.vue");
        }
      }
    ]
  }
];

export default routes;
