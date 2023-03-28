import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import components from "./components";
import piniaStore from "@/store";

// --- 公用库 --- //
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./assets/css/element-var.scss";

// --- 公用样式 --- //
import "./assets/css/common.css";
import "./assets/css/common.scss";
import "font-awesome/css/font-awesome.css";
import "nprogress/nprogress.css";

// --- 工具 --- //
import "./environment";
import "./utils/http/interceptor";
import './mock'

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.use(components);
app.use(router);
app.use(piniaStore);

app.mount("#app");
