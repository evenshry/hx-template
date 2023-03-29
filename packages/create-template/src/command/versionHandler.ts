#! /usr/bin/env node
import chalk from "chalk";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// 获取当前文件夹
const __dirname = dirname(fileURLToPath(import.meta.url));
// 回到项目根目录
const basePath = resolve(__dirname, "../../");

/**
 * 执行
 */
function execute() {
  try {
    // 读取package.json文件
    const text = fs.readFileSync(basePath + "/package.json", "utf8");
    const configJson = JSON.parse(text);
    // 获取版本信息并打印
    const name = configJson.name;
    const version = configJson.version;
    console.log(chalk.green(`${name} v${version}`));
  } catch (error) {
    console.log(chalk.red("fail"));
  }
}

export default {
  execute
};
