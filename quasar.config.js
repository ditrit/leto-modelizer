/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js

const ESLintPlugin = require('eslint-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

/* eslint func-names: 0 */
/* eslint global-require: 0 */

const { configure } = require('quasar/wrappers');
const { version } = require('./package.json');

const removeAttribute = (node) => {
  if (process.env.KEEP_CYPRESS_ATTRIBUTE === 'true' || process.env.NODE_ENV === 'development') {
    return;
  }

  const attributesToRemove = ['data-cy'];
  const nodeIsElement = node.type === 1;

  if (nodeIsElement) {
    node.props = node.props.filter((prop) => {
      const propIsAttribute = prop.type === 6;
      const propIsDynamicAttribute = prop.name === 'bind';

      if (propIsAttribute) {
        const attributeName = prop.name;

        return !attributesToRemove.includes(attributeName);
      }

      if (propIsDynamicAttribute) {
        const attributeName = prop.arg?.content;

        return !attributesToRemove.includes(attributeName);
      }

      return true;
    });
  }
};

module.exports = configure((ctx) => ({
  // https://v2.quasar.dev/quasar-cli-webpack/supporting-ts
  supportTS: false,

  // https://v2.quasar.dev/quasar-cli-webpack/prefetch-feature
  // preFetch: true,

  // app boot file (/src/boot)
  // --> boot files are part of "main.js"
  // https://v2.quasar.dev/quasar-cli-webpack/boot-files
  boot: [
    'i18n',
    'browserfs',
    'vue-sanitize',
    'axios',
    'v-viewer',
  ],

  // https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-css
  css: [
    'app.scss',
  ],

  // https://github.com/quasarframework/quasar/tree/dev/extras
  extras: [
    // 'ionicons-v4',
    // 'mdi-v5',
    // 'fontawesome-v6',
    // 'material-icons',
    // 'eva-icons',
    // 'themify',
    // 'line-awesome',
    // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

    'roboto-font', // optional, you are not bound to it
    'fontawesome-v6', // optional, you are not bound to it
  ],

  // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-build
  build: {
    vueRouterMode: 'hash', // available values: 'hash', 'history'

    // transpile: false,
    // publicPath: '/',

    // Add dependencies for transpiling with Babel (Array of string/regex)
    // (from node_modules, which are by default not transpiled).
    // Applies only if "transpile" is set to true.
    // transpileDependencies: [],

    // rtl: true, // https://quasar.dev/options/rtl-support
    // preloadChunks: true,
    // showProgress: false,
    // gzip: true,
    // analyze: true,

    // Options below are automatically set depending on the env, set them if you want to override
    env: {
      CORS_ISOMORPHIC_BASE_URL: process.env.CORS_ISOMORPHIC_BASE_URL || 'https://cors.isomorphic-git.org',
      TEMPLATE_LIBRARY_BASE_URL: process.env.TEMPLATE_LIBRARY_BASE_URL || '',
      MODELS_DEFAULT_FOLDER: process.env.MODELS_DEFAULT_FOLDER || '',
      VERSION: version,
    },
    // extractCSS: false,

    // https://v2.quasar.dev/quasar-cli-webpack/handling-webpack
    // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain

    chainWebpack(chain) {
      chain.plugin('eslint-webpack-plugin')
        .use(ESLintPlugin, [{ extensions: ['js', 'vue'] }]);
      chain.plugin('monaco-editor-webpack-plugin')
        .use(MonacoWebpackPlugin, [{ extensions: ['js', 'vue'] }]);
      chain.module
        .rule('vue')
        .use('vue-loader')
        .tap((options) => {
          options.compilerOptions = {
            ...(options.compilerOptions || {}),
            nodeTransforms: [removeAttribute],
          };

          return options;
        });
    },

  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-devServer
  devServer: {
    server: {
      type: 'http',
    },
    port: 8080,
    open: false, // opens browser window automatically
    proxy: {
      '/template-library': {
        pathRewrite: { '^/template-library': '' },
        target: process.env.TEMPLATE_LIBRARY_BASE_URL,
        secure: false,
        changeOrigin: true,
      },
    },
  },

  // https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-framework
  framework: {
    config: {
      notify: {},
    },

    iconSet: 'fontawesome-v6',
    // iconSet: 'material-icons', // Quasar icon set
    // lang: 'en-US', // Quasar language pack

    // For special cases outside of where the auto-import strategy can have an impact
    // (like functional components as one of the examples),
    // you can manually specify Quasar components/directives to be available everywhere:
    //
    // components: [],
    // directives: [],

    // Quasar plugins
    plugins: ['Notify'],
  },

  // animations: 'all', // --- includes all animations
  // https://quasar.dev/options/animations
  animations: [],

  // https://v2.quasar.dev/quasar-cli-webpack/developing-ssr/configuring-ssr
  ssr: {
    pwa: false,

    // manualStoreHydration: true,
    // manualPostHydrationTrigger: true,

    prodPort: 3000, // The default port that the production server should use
    // (gets superseded if process.env.PORT is specified at runtime)

    maxAge: 1000 * 60 * 60 * 24 * 30,
    // Tell browser when a file from the server should expire from cache (in ms)

    chainWebpackWebserver(chain) {
      chain.plugin('eslint-webpack-plugin')
        .use(ESLintPlugin, [{ extensions: ['js'] }]);
      chain.plugin('monaco-editor-webpack-plugin')
        .use(MonacoWebpackPlugin, [{ extensions: ['js', 'vue'] }]);
    },

    middlewares: [
      ctx.prod ? 'compression' : '',
      'render', // keep this as last one
    ],
  },

  // https://v2.quasar.dev/quasar-cli-webpack/developing-pwa/configuring-pwa
  pwa: {
    workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
    workboxOptions: {}, // only for GenerateSW

    // for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
    // if using workbox in InjectManifest mode

    chainWebpackCustomSW(chain) {
      chain.plugin('eslint-webpack-plugin')
        .use(ESLintPlugin, [{ extensions: ['js'] }]);
      chain.plugin('monaco-editor-webpack-plugin')
        .use(MonacoWebpackPlugin, [{ extensions: ['js', 'vue'] }]);
    },

    manifest: {
      name: 'Leto Modelizer',
      short_name: 'Leto Modelizer',
      description: 'Technical topology low-code editing tools.',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#ffffff',
      theme_color: '#027be3',
      icons: [
        {
          src: 'icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png',
        },
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/icon-256x256.png',
          sizes: '256x256',
          type: 'image/png',
        },
        {
          src: 'icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-cordova-apps/configuring-cordova
  cordova: {
    // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-capacitor-apps/configuring-capacitor
  capacitor: {
    hideSplashscreen: true,
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/configuring-electron
  electron: {
    bundler: 'packager', // 'packager' or 'builder'

    packager: {
      // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

      // OS X / Mac App Store
      // appBundleId: '',
      // appCategoryType: '',
      // osxSign: '',
      // protocol: 'myapp://path',

      // Windows only
      // win32metadata: { ... }
    },

    builder: {
      // https://www.electron.build/configuration/configuration

      appId: 'leto-modelizer',
    },

    // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain

    chainWebpackMain(chain) {
      chain.plugin('eslint-webpack-plugin')
        .use(ESLintPlugin, [{ extensions: ['js'] }]);
      chain.plugin('monaco-editor-webpack-plugin')
        .use(MonacoWebpackPlugin, [{ extensions: ['js', 'vue'] }]);
    },

    chainWebpackPreload(chain) {
      chain.plugin('eslint-webpack-plugin')
        .use(ESLintPlugin, [{ extensions: ['js'] }]);
      chain.plugin('monaco-editor-webpack-plugin')
        .use(MonacoWebpackPlugin, [{ extensions: ['js', 'vue'] }]);
    },

  },
}));
