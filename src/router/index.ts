import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/add', component: () => import('../views/AddAccountView.vue') },
  { path: '/edit/:id', component: () => import('../views/EditAccountView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;