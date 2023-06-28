import ModelsRoute from 'src/router/routes/ModelsRoute';
import ModelizerDrawLayout from 'src/layouts/ModelizerDrawLayout.vue';
import ModelizerTextLayout from 'src/layouts/ModelizerTextLayout.vue';
import { getProjectById } from 'src/composables/Project';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('pages/HomePage.vue') },
      { path: '/about', name: 'About', component: () => import('pages/AboutPage.vue') },
      {
        path: '/:projectName/diagrams',
        name: 'Diagrams',
        component: () => import('pages/DiagramsPage.vue'),
      },
    ],
  },
  ModelsRoute,
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
    ],
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
