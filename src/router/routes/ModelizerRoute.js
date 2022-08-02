import ModelizerPage from 'src/pages/ModelizerPage.vue';
import { getProjectById } from 'src/composables/Project';

const ModelizerLongRoute = {
  name: 'modelizer',
  path: '/modelizer/:projectName/:viewType',
  component: ModelizerPage,
  beforeEnter: (to, _from, next) => {
    const valideViewTypes = ['model', 'text'];
    const project = getProjectById(to.params.projectName);

    if (!project || !valideViewTypes.includes(to.params.viewType)) {
      next({ name: 'Error' });
    } else {
      next();
    }
  },
};

const ModelizerRoute = {
  path: '/modelizer/:projectName',
  redirect: (to) => ({
    name: 'modelizer',
    params: {
      projectName: to.params.projectName,
      viewType: 'model',
    },
  }),
  children: [
    ModelizerLongRoute,
  ],
};

export default ModelizerRoute;
