import { defineStore } from "pinia";

const TOKEN = "TOKEN";

export interface CommonState {
  token: string;
  theme: string;
}

export const commonStore = defineStore("common", {
  state: (): CommonState => {
    return {
      token: "",
      theme: "default"
    };
  },

  getters: {
    getToken(state: CommonState): string {
      let token = state.token || "";
      if (token) {
        return token;
      } else {
        try {
          const localToken = localStorage.getItem(TOKEN);
          if (localToken) {
            state.token = localToken;
            token = localToken;
          }
        } finally {
        }
        return token;
      }
    },
    getTheme: (state: CommonState): string => {
      return state.theme;
    }
  },

  actions: {
    setToken(value: string): void {
      localStorage.setItem(TOKEN, value);
      this.token = value;
    }
  }
});
