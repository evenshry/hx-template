import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, "./"),
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  plugins: [vue()],
  server: {
    hmr: true,
    port: 8091,
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    strictPort: false, // 设为 false 时，若端口已被占用则会尝试下一个可用端口,而不是直接退出
    https: false, // 是否开启 https
    cors: true // 为开发服务器配置 CORS。默认启用并允许任何源
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:8080",
    //     changeOrigin: true
    //   }
    // }
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    assetsDir: "assets", // 指定生成静态资源的存放路径
    sourcemap: false, // 构建后是否生成 source map 文件
    minify: "terser", // 混淆器，terser构建后文件体积更小
    terserOptions: {
      compress: {
        drop_console: true, //移除console
        drop_debugger: true //移除 debugger
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          libs: ["vue", "vue-router", "pinia"],
          libs_ui: ["element-plus", "less", "sass", "animate.css", "nprogress"],
          libs_wangeditor: ["@wangeditor/editor", "@wangeditor/editor-for-vue"],
          libs_tool: ["js-md5", "moment", "ali-oss", "axios"]
        }
      }
    }
  }
});
