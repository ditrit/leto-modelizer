import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
} from 'vue-router';
import routes from 'src/router/routes';
import { getUserSessionToken, removeUserSessionToken } from 'src/composables/UserAuthentication';
import PluginEvent from 'src/composables/events/PluginEvent';
import { getAuthenticationUrl } from 'src/composables/LetoModelizerApi';
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
  let backendUrl;
  if (process.env.HAS_BACKEND) {
    backendUrl = await getAuthenticationUrl();
  }

  Router.beforeEach(async (to, from, next) => {
    const isComingFromGithub = window.location.href.search(/\?code=([^&]*)/) !== -1;
    const isUserReady = getUserSessionToken() || isComingFromGithub || !process.env.HAS_BACKEND;
    let temporaryCode;

    if (to.name === 'ClearToken') {
      removeUserSessionToken();
      next('/');
      return;
    }

    if (isComingFromGithub) {
      temporaryCode = /\?code=([^&]*)/.exec(window.location.href)[1].substring(0, 20);
    }

    if (!isUserReady && process.env.HAS_BACKEND) {
      window.location.href = backendUrl.data;
    } else if (isUserReady
      && !applicationReady
      && to.name !== 'Splash') {
      next({ name: 'Splash', query: { from: to.fullPath, authCode: temporaryCode } });
    } else if (to.name === 'Admin' && !acl.role('admin')) {
      next('/');
    } else if (to.name === 'Admin') {
      window.location.href = `${process.env.ADMIN_URL}?token=${getUserSessionToken()}`;
    } else {
      next();
    }
  });

  return Router;
});
