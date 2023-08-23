import { route } from 'quasar/wrappers';
import {
  createRouter, createMemoryHistory, createWebHistory, createWebHashHistory,
} from 'vue-router';
import routes from 'src/router/routes';
import { userManagerExists, getUser } from 'src/composables/UserAuthentication';
import PluginEvent from 'src/composables/events/PluginEvent';

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

export default route((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const authRoutes = ['SilentRefresh', 'Redirect', 'Login'];
    const oidcProviderList = process.env.AUTHENTICATION
      ? JSON.parse(process.env.AUTHENTICATION)
      : [];
    const isUserReady = oidcProviderList.length === 0
      || (userManagerExists() && await getUser());

    if (!authRoutes.includes(to.name) && !isUserReady) {
      next({ name: 'Login' });
    } else if (isUserReady
      && !applicationReady
      && to.name !== 'Splash') {
      next({ name: 'Splash', query: { from: to.fullPath } });
    } else {
      next();
    }
  });

  return Router;
});
