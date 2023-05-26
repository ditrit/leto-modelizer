import ModelsRoute from 'src/router/routes/ModelsRoute';
import ModelizerRoute from 'src/router/routes/ModelizerRoute';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('pages/HomePage.vue') },
      { path: '/about', name: 'About', component: () => import('pages/AboutPage.vue') },
      ModelsRoute,
      ModelizerRoute,
      {
        path: '/:projectName/diagrams',
        name: 'Diagrams',
        component: () => import('pages/DiagramsPage.vue'),
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
