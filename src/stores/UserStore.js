import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({ username: '', firstname: '' }),
  getters: {
    isEmpty: (state) => state.username.length === 0 && state.firstname.length === 0,
  },
});
