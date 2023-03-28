import { createPinia } from "pinia";
import { commonStore } from "@/store/commonStore";
import { keepAliveStore } from "@/store/keepAliveStore";
import { sysRoleStore } from "@/store/sysRoleStore";

const piniaStore = createPinia();

export function usePiniaStore() {
  return {
    CommonStore: commonStore(),
    KeepAliveStore: keepAliveStore(),
    SysRoleStore: sysRoleStore()
  };
}

export default piniaStore;
