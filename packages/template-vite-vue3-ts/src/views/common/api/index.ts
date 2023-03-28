import http from "@/utils/http";

/**
 * 登录
 * @param params
 * @returns
 */
export function login(params: User.LoginParams): Http.PrNormal<User.LoginResult> {
  return http.post("/admin/login", params);
}

/**
 * 登出
 * @returns
 */
export function logout(): Http.PrNormal<void> {
  return http.get("/admin/user/loginOut");
}

/**
 * 查询用户信息
 * @returns
 */
export function fetchUserInfo(): Http.PrNormal<User.LoginResult> {
  return http.get("/admin/user/detailByToken");
}

/**
 * 查询菜单
 * @returns
 */
export function fetchMenuList(): Http.PrNormal<Menu.Item[]> {
  return http.get("/admin/user/resources");
}
