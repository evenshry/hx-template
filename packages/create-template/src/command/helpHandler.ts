#! /usr/bin/env node
import commandLineUsage from "command-line-usage";
import chalk from "chalk";

// 帮助内容
const helpSections:commandLineUsage.Section[] = [
  {
    header: "create-hx",
    content: "A cli for quickly generating project and environment"
  },
  {
    header: "Options",
    optionList: [
      {
        name: "version",
        alias: 'v',
        typeLabel: "{underline boolean}",
        description: "version of create-template"
      },
      {
        name: 'help',
        alias: 'h',
        typeLabel: "{underline boolean}",
        description: 'Print this usage guide.'
      }
    ]
  }
];

/**
 * 执行
 */
function execute() {
  try {
    // 转换帮助内容
    const content = commandLineUsage(helpSections);
    // 打印帮助内容，使用绿色粉笔
    console.log(chalk.green(content));
  } catch (error) {
    console.log(chalk.red("fail"));
  }
}

export default {
  execute
};
