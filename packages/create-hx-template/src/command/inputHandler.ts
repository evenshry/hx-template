#! /usr/bin/env node
import download from "download-git-repo";
import chalk from "chalk";
import prompts from "prompts";
import ora from "ora";
import fs from "fs";

// 输入表单定义
const promptsOptions: Array<prompts.PromptObject> = [
  {
    type: "text", // 文本
    name: "name",
    message: "project-name",
    initial: "hx-new-project",
    validate(val) {
      if (!val) return "项目名称不能为空！";
      if (fs.existsSync(val)) return "项目名称已存在";
      if (val.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) return "项目名称包含非法字符，请重新输入";
      return true;
    }
  },
  {
    type: "select", //单选
    name: "template",
    message: "select a template",
    choices: [{ title: "vite+vue+router+pinia+typescript", value: 0 }]
  }
];

// 模版地址配置，需要公开的代码库
const remoteTemplateList: Array<string> = ["https://gitee.com/evenshry/vite-vue3-template.git"];

// 默认分支
const branch = "master";

/**
 * 下载模版
 * @param remote
 * @param name
 * @param option
 * @returns
 */
function gitClone(remote: string, name: string, option: any) {
  const loadingOra = ora("正在下载模板...").start();
  return new Promise((resolve, reject) => {
    download(remote, name, option, (err: any) => {
      if (err) {
        loadingOra.fail();
        console.log("err", chalk.red(err));
        reject(err);
        return;
      }
      loadingOra.succeed(chalk.green("success"));
      resolve(true);
    });
  });
}

/**
 * 执行
 */
async function execute() {
  try {
    const res = await prompts(promptsOptions);
    if (res.name && res.template != undefined) {
      const templateUrl = remoteTemplateList[res.template || 0];
      await gitClone(`direct:${templateUrl}#${branch}`, res.name, { clone: true });
      // 下载成功，打印项目初始化命令
      console.log(`Done. Now run:\r\n`);
      console.log(chalk.green(`cd ${res.name}`));
      console.log(chalk.blue("yarn install"));
      console.log("yarn run dev\r\n");
    }
  } catch (error) {
    console.log(chalk.red("fail"));
  }
}

export default {
  execute
};
