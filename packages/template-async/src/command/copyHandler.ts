#! /usr/bin/env node
import chalk from "chalk";
import fs from "fs";
import path from "path";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// 获取当前文件夹
const __dirname = dirname(fileURLToPath(import.meta.url));
// packages项目列表目录
const packagesPath = path.resolve(__dirname, "../../../");
// CLI项目模版目录
const destinationPath = path.resolve(__dirname, "../../../create-template/template/");
// 忽略列表
const ignoreList = ["node_modules", ".DS_Store"];

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
      if (!ignoreList.includes(file.name)) {
        const source = sourcePath + "/" + file.name;
        const dest = destPath + "/" + file.name;
        await fs.cpSync(source, dest, { recursive: true });
        console.log(chalk.green(file.name + " asynced."));
      }
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
    // 读取目录
    const files = await fs.readdirSync(packagesPath, { withFileTypes: true });
    // 循环处理子目录
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.isDirectory() && file.name.startsWith("template-") && file.name != "template-async") {
        const source = packagesPath + "/" + file.name;
        const dest = destinationPath + "/" + file.name;
        console.log(chalk.yellow("\r\n" + file.name + " start asyncing:"));
        await copyDirFiles(source, dest);
      }
    }
    chalk.green("Asyncing succeeded!");
  } catch (error) {
    console.log(chalk.red(error));
  }
}

export default {
  execute
};
