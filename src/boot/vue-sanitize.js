import { boot } from 'quasar/wrappers';
import Vue3Sanitize from 'vue-3-sanitize';

export default boot(({ app }) => {
  app.use(Vue3Sanitize);
});
