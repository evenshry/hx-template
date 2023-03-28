import Mock from "mockjs";
import moment from "moment";
import { ImageArticle } from "@/mock/image";
import querystring from "@/utils/http/querystring";

const defaultList: Array<KnowledgeLib.ListItem> = [
  {
    articleId: "11111111",
    title: Mock.Random.ctitle(10, 20),
    imageUrl: ImageArticle,
    publishTime: moment().format("YYYY-MM-DD"),
    category: "技术论坛",
    content: `<p>${Mock.Random.cparagraph()}</p>`,
    status: 20,
    collect: true,
    top: false
  },
  {
    articleId: "11111111",
    title: Mock.Random.ctitle(10, 20),
    imageUrl: ImageArticle,
    publishTime: moment().format("YYYY-MM-DD"),
    category: "学习园地",
    content: `<p>${Mock.Random.cparagraph()}</p>`,
    status: 20,
    collect: true,
    top: false
  }
];

Mock.mock(/^\/mock\/article\/article\?.+/, "get", (config) => {
  const params = querystring.parseUrl(config.url).query;
  const page: number = Number(params.page);
  const pageLimit: number = Number(params.pageLimit);
  const start: number = (page - 1) * pageLimit;
  const end = page * pageLimit;
  let list = defaultList.slice(start, end);
  if (params.title) {
    list = list.filter((item) => item.title && item.title.indexOf(params.title) > -1);
  }
  return {
    code: 0,
    msg: "成功!",
    data: {
      totalCount: list.length,
      page: page,
      pageLimit: pageLimit,
      totalPage: Math.floor(list.length / pageLimit),
      entries: list
    }
  };
});

Mock.mock(/^\/mock\/article\/articleDetail\?.+/, (config) => {
  const params = querystring.parseUrl(config.url).query;
  const detail = defaultList.find((item) => item.articleId == params.articleId);
  return { code: 0, msg: "成功!", data: detail };
});

Mock.mock("/mock/article/article", "post", (config) => {
  const params = JSON.parse(config.body);
  const data = {
    title: params.title,
    imageUrl: params.imageUrl,
    publishTime: moment().format("YYYY-MM-DD"),
    category: params.category,
    content: params.content,
    status: 20,
    top: params.top
  };
  defaultList.push(data);
  return { code: 0, msg: "操作成功!", data: null };
});

Mock.mock("/mock/article/article", "put", (config) => {
  const params = JSON.parse(config.body);
  const index = defaultList.findIndex((item) => item.articleId == params.articleId);
  defaultList[index].title = params.title;
  defaultList[index].category = params.category;
  defaultList[index].imageUrl = params.imageUrl;
  defaultList[index].content = params.content;
  defaultList[index].top = params.top;
  return { code: 0, msg: "操作成功!", data: null };
});

Mock.mock(/^\/mock\/article\/article\?.+/, "delete", (config) => {
  const params = querystring.parseUrl(config.url).query;
  const index = defaultList.findIndex((item) => item.articleId == params.articleId);
  defaultList.splice(index, 1);
  return { code: 0, msg: "操作成功!", data: null };
});

Mock.mock("/mock/article/upperShelvesArticle", "put", (config) => {
  const params = JSON.parse(config.body);
  const index = defaultList.findIndex((item) => item.articleId == params.articleId);
  defaultList[index].status = 10;
  return { code: 0, msg: "操作成功!", data: null };
});

Mock.mock("/mock/article/lowerShelvesArticle", "put", (config) => {
  const params = JSON.parse(config.body);
  const index = defaultList.findIndex((item) => item.articleId == params.articleId);
  defaultList[index].status = 20;
  return { code: 0, msg: "操作成功!", data: null };
});
