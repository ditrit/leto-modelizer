import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    login: '',
    email: '',
    permissions: [],
  }),
  getters: {
    isEmpty: (state) => state.login.length === 0,
  },
});
