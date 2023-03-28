declare namespace User {
  interface AccountType {
    PLATFORM: "1";
    DEPARTMENT: "2";
  }

  /**
   * 登录参数
   */
  interface LoginParams {
    username?: string;
    password?: string;
  }

  /**
   * 登录返回数据
   */
  interface LoginResult {
    token?: string;
    adminUserId?: string;
    email?: string;
    name?: string;
    phone?: string;
    status?: string;
  }
}

declare namespace Menu {
  /**
   * 登录返回数据
   */
  interface Item {
    parentId?: string;
    resourcesId?: string;
    url?: string;
    icon?: string;
    name?: string;
    type?: string;
    children?: Array<Item>;
    params?: {
      showDots?: boolean;
    };
  }
}
