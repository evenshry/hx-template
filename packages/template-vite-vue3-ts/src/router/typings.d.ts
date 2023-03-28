import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    title: string;
    keepAlive?: boolean; // 该路由页面是否需要缓存
    keepAlivePages?: Array<string>; // 配置需要缓存的跳回来源（从某页面回到该页面，该页面缓存，其他页面回到该页面，该页面不缓存）
    canBack?: boolean; // 是否可以返回
  }
}
