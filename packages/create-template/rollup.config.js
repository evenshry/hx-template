import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import json from "@rollup/plugin-json";
// @ts-ignore
import copy from "rollup-plugin-copy";

export default {
  input: "src/main.ts", // 打包入口
  output: [
    {
      file: "dist/main.js", // 最终打包出来的文件路径和文件名，这里是在package.json的browser: 'dist/index.js'字段中配置的
      format: "cjs"
    }
  ],
  plugins: [
    resolve(), // 查找和打包node_modules中的第三方模块
    commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    typescript(), // 解析TypeScript
    json(),
    copy({ targets: [{ src: "src/template/*", dest: "dist/template" }] })
  ]
};
