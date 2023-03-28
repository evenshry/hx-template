import { defineStore } from "pinia";

export interface KeepAliveState {
  keepAliveComponents: Array<any>;
  refreshTable: boolean;
}

export const keepAliveStore = defineStore("keepAlive", {
  state: (): KeepAliveState => {
    return {
      keepAliveComponents: [],
      refreshTable: false
    };
  },

  getters: {
    getKeepAliveComponents(state) {
      return state.keepAliveComponents;
    },
    getRefreshTable(state) {
      return state.refreshTable;
    }
  },

  actions: {
    setKeepAlive(component: any) {
      if (!this.keepAliveComponents.includes(component)) {
        this.keepAliveComponents.push(component);
      }
    },
    removeKeepAlive(component: any) {
      const index = this.keepAliveComponents.indexOf(component);
      if (index !== -1) {
        this.keepAliveComponents.splice(index, 1);
      }
    },
    needRefreshTable(value: boolean) {
      this.refreshTable = value;
    }
  }
});
