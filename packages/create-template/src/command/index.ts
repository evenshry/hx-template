#! /usr/bin/env node
import commandLineArgs from "command-line-args";
import helpHandler from "./helpHandler.js";
import versionHandler from "./versionHandler.js";
import inputHandler from "./inputHandler.js";

/**
 * 参数定义
 */
interface Options extends commandLineArgs.CommandLineOptions {
  help: boolean;
  version: boolean;
}

// 定义命令集
const optionDefinitions = [
  { name: "help", alias: "h", type: Boolean },
  { name: "version", alias: "v", type: Boolean }
];

/**
 * 执行
 */
function execute() {
  // 转换命令集
  const options = commandLineArgs(optionDefinitions) as Options;
  // 执行帮助命令
  if (options.help) {
    helpHandler.execute();
  }
  // 执行版本命令
  else if (options.version) {
    versionHandler.execute();
  }
  // 没有参数，执行默认进程
  else {
    inputHandler.execute();
  }
}

export default {
  execute
};
