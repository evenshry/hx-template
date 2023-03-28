import Mock from "mockjs";

import "./common";
import "./knowledge";

// 设置拦截ajax请求的相应时间
Mock.setup({
  timeout: "200-600"
});
