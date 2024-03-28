import { defineStore } from 'pinia';

export const useCsrfStore = defineStore('crsf', {
  state: () => ({
    headerName: '',
    token: '',
    expirationDate: 0,
  }),
});
