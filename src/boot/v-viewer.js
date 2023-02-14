import { boot } from 'quasar/wrappers';
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';

export default boot(({ app }) => {
  app.use(VueViewer, {
    defaultOptions: {
      zIndex: 9999,
      button: false,
      navbar: false,
      title: false,
      toolbar: false,
    },
  });
});
