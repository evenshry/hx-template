#! /usr/bin/env node
import chalk from "chalk";
import prompts from "prompts";
import ora from "ora";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// 获取当前文件夹
// const __dirname = dirname(fileURLToPath(import.meta.url));
// 模版目录
const templatePath = path.resolve(__dirname, "../template/");

// 输入表单定义
const promptsOptions: Array<prompts.PromptObject> = [
  {
    type: "text", // 文本
    name: "name",
    message: "project-name",
    initial: "hx-new-project",
    validate(value) {
      if (!value) return "Project name cannot be empty!";
      if (fs.existsSync(value)) return "Project name already exists!";
      if (value.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) return "The project name contains illegal characters, please try again!";
      return true;
    }
  },
  {
    type: "select", //单选
    name: "template",
    message: "select a template",
    choices: [{ title: "vite+vue3+pinia+ts", value: 0 }]
  }
];

// 本地模版列表
const templateList: Array<string> = ["template-vite-vue3-ts"];

/**
 * 拷贝模版
 * @param sourcePath
 * @param destPath
 */
async function copyDirFiles(sourcePath: string, destPath: string) {
  try {
    // 读取目录
    const files = await fs.readdirSync(sourcePath, { withFileTypes: true });
    // 循环复制子目录或文件
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const source = sourcePath + "/" + file.name;
      const dest = destPath + "/" + file.name;
      await fs.cpSync(source, dest, { recursive: true });
      console.log(chalk.green(file.name + " created."));
    }
  } catch (error) {
    console.log(chalk.red(error));
  }
}

/**
 * 执行
 */
async function execute() {
  try {
    const res = await prompts(promptsOptions);
    if (res.name && res.template != undefined) {
      const templateUrl = templateList[res.template || 0];
      const source = templatePath + "/" + templateUrl;
      const dest = process.cwd() + "/" + res.name;
      await copyDirFiles(source, dest);
      // 下载成功，打印项目初始化命令
      console.log(`Completed. Now run:\r\n`);
      console.log(chalk.yellow(`cd ${res.name}`));
      console.log(chalk.green("yarn install"));
      console.log("yarn run dev\r\n");
      console.log("Do your magic ~\r\n");
    }
  } catch (error) {
    console.log(chalk.red("fail"));
  }
}

export default {
  execute
};
