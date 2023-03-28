import { defineStore } from "pinia";
import { usePiniaStore } from "@/store";

const ROLE_TYPE: string = "ROLE_TYPE";
const ROLE_DATA: string = "ROLE_DATA";

export const AccountType: User.AccountType = {
  PLATFORM: "1",
  DEPARTMENT: "2"
};

export interface SysRoleData extends User.LoginResult {}

export interface SysRoleState {
  role: string;
  roleData: SysRoleData;
  currentPath: string;
  consoleMenus: Array<Menu.Item>;
  showDots: boolean;
}

/**
 * 保存角色数据
 * @param roleData
 * @returns
 */
function convertRoleData(roleData: SysRoleData): SysRoleData {
  if (!roleData.token) {
    const dataStr = localStorage.getItem(ROLE_DATA);
    if (dataStr) {
      let tempData: SysRoleData = {};
      try {
        tempData = JSON.parse(dataStr);
      } finally {
        roleData = tempData;
      }
    }
  }
  return roleData;
}

export const sysRoleStore = defineStore("sysRole", {
  state: (): SysRoleState => {
    return {
      role: "",
      roleData: {},
      currentPath: "",
      consoleMenus: [],
      showDots: false
    };
  },

  getters: {
    isPLATFORM: (state: SysRoleState): boolean => {
      if (!state.role) {
        const userType = localStorage.getItem(ROLE_TYPE);
        if (userType) {
          state.role = userType;
        }
      }
      return state.role == AccountType.PLATFORM;
    },

    isDEPARTMENT: (state: SysRoleState): boolean => {
      if (!state.role) {
        const userType = localStorage.getItem(ROLE_TYPE);
        if (userType) {
          state.role = userType;
        }
      }
      return state.role == AccountType.DEPARTMENT;
    },

    getRoleData: (state: SysRoleState): SysRoleData => {
      return convertRoleData(state.roleData);
    },

    getCurrentPath: (state: SysRoleState): string => {
      return state.currentPath;
    },

    getConsoleMenus: (state: SysRoleState): Array<Menu.Item> => {
      return state.consoleMenus;
    },

    getDots: (state: SysRoleState): boolean => {
      return state.showDots;
    }
  },

  actions: {
    checkRole(role: string, value: string): boolean {
      if (!role) {
        const userType = localStorage.getItem(ROLE_TYPE);
        if (userType) {
          role = userType;
          this.setRole(userType);
        }
      }
      return role == value;
    },
    setRole(value: string): void {
      this.role = value;
      localStorage.setItem(ROLE_TYPE, value);
    },

    setRoleData(data: SysRoleData, clear?: boolean): void {
      if (clear) {
        this.roleData = {};
        localStorage.setItem(ROLE_DATA, "");
      } else {
        this.roleData = { ...this.roleData, ...data };
        localStorage.setItem(ROLE_DATA, JSON.stringify(this.roleData));
      }
    },

    setCurrentPath(value: string): void {
      this.currentPath = value;
    },

    setConsoleMenus(data: Array<Menu.Item>): void {
      this.consoleMenus = data;
    },

    setDots(value: boolean): void {
      this.showDots = value;
    },

    clear(): void {
      const { CommonStore } = usePiniaStore();
      CommonStore.setToken("");
      this.setRole("");
      this.setRoleData({}, true);
      this.setCurrentPath("");
    }
  }
});
