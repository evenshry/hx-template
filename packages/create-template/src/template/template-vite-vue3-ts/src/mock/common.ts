import Mock from "mockjs";

Mock.mock("/mock/admin/login", () => {
  return { code: 0, msg: "成功!", data: { token: "66a2578fef0b4228931281794333b224" } };
});

Mock.mock("/mock/admin/user/loginOut", () => {
  return { code: 0, msg: "退出登陆成功", data: null };
});

Mock.mock("/mock/admin/user/detailByToken", () => {
  return {
    code: 0,
    msg: "成功!",
    data: {
      adminUserId: "7307560917666947157",
      name: "管理员",
      phone: "13234234234",
      email: "s@d.cn",
      status: 10
    }
  };
});

Mock.mock("/mock/admin/user/resources", () => {
  return {
    code: 0,
    msg: "成功!",
    data: [
      {
        resourcesId: "7295282018484158464",
        name: "首页",
        icon: null,
        url: "/pages/home",
        type: "top"
      },
      {
        resourcesId: "7295282018484158511",
        name: "知识库",
        icon: "icon-zhishiku",
        url: "/pages/knowledge",
        type: "top",
        children: [
          {
            resourcesId: "7295282018484158596",
            name: "知识库",
            icon: "icon-zhishiku",
            url: "/pages/knowledge/library/list",
            type: "left"
          },
          {
            resourcesId: "7295282018484158596",
            name: "发布",
            icon: "icon-fabu",
            url: "/pages/knowledge/publish",
            type: "left"
          }
        ]
      }
    ]
  };
});
