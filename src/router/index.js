import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
} from 'vue-router';
import routes from 'src/router/routes';
import PluginEvent from 'src/composables/events/PluginEvent';
import { useAcl } from 'vue-simple-acl';

let applicationReady = false;

PluginEvent.InitEvent.subscribe(() => {
  applicationReady = true;
});

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(async () => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : createWebHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
  });

  // No need to do this call each time, so doing it outside the beforeEach.
  const acl = useAcl();

  Router.beforeEach(async (to, from, next) => {
    if (!applicationReady && to.name !== 'Splash') {
      next({ name: 'Splash', query: { from: to.fullPath } });
    } else if (to.name === 'Admin' && !acl.role('admin')) {
      next('/');
    } else if (to.name === 'Admin') {
      window.location.href = `${process.env.BACKEND_URL}/api/redirect?app=admin`;
    } else {
      next();
    }
  });

  return Router;
});
