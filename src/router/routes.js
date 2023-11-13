import ModelizerDrawLayout from 'src/layouts/ModelizerDrawLayout.vue';
import ModelizerTextLayout from 'src/layouts/ModelizerTextLayout.vue';
import ProjectLayout from 'src/layouts/ProjectLayout.vue';
import DiagramsLayout from 'src/layouts/DiagramsLayout.vue';
import AboutLayout from 'src/layouts/AboutLayout.vue';
import HomeLayout from 'src/layouts/HomeLayout.vue';
import { getProjectById } from 'src/composables/Project';
import SplashLayout from 'layouts/SplashLayout.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeLayout,
  },
  {
    path: '/projects/:projectName',
    beforeEnter: (to, _from, next) => {
      const project = getProjectById(to.params.projectName);

      if (!project) {
        next({ name: 'Error' });
      } else {
        next();
      }
    },
    children: [
      {
        path: 'modelizer/draw',
        name: 'Draw',
        component: ModelizerDrawLayout,
      },
      {
        path: 'modelizer/text',
        name: 'Text',
        component: ModelizerTextLayout,
      },
      {
        path: 'models',
        name: 'Models',
        component: ProjectLayout,
      },
      {
        path: 'diagrams',
        name: 'Diagrams',
        component: DiagramsLayout,
      },
    ],
  },
  {
    path: '/about',
    name: 'About',
    component: AboutLayout,
  },
  {
    path: '/splash',
    name: 'Splash',
    component: SplashLayout,
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'Error',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
