import ModelizerRoute from 'src/router/routes/ModelizerRoute';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      ModelizerRoute,
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
