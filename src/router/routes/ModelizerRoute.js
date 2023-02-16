import ModelizerPage from 'src/pages/ModelizerPage.vue';
import { getProjectById } from 'src/composables/Project';

const ModelizerLongRoute = {
  name: 'modelizer',
  path: '/:projectName/modelizer/:viewType',
  component: ModelizerPage,
  beforeEnter: (to, _from, next) => {
    const valideViewTypes = ['draw', 'text'];
    const project = getProjectById(to.params.projectName);

    if (!project || !valideViewTypes.includes(to.params.viewType)) {
      next({ name: 'Error' });
    } else {
      next();
    }
  },
};

const ModelizerRoute = {
  path: '/:projectName/modelizer',
  redirect: (to) => ({
    name: 'modelizer',
    params: {
      projectName: to.params.projectName,
      viewType: 'draw',
    },
  }),
  children: [
    ModelizerLongRoute,
  ],
};

export default ModelizerRoute;
