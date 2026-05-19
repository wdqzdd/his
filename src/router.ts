import { createRouter, createWebHistory } from 'vue-router';
import { stationMenus } from './data/workstations';
import LoginPage from './pages/LoginPage.vue';
import WorkspaceShell from './pages/WorkspaceShell.vue';
import BusinessPage from './pages/BusinessPage.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/identity',
      name: 'identity',
      component: () => import('./pages/IdentityPage.vue'),
    },
    {
      path: '/workspace/:workspace',
      component: WorkspaceShell,
      redirect: (to) => {
        const workspace = decodeURIComponent(String(to.params.workspace || '科室看板'));
        const firstMenu = stationMenus[workspace]?.[0]?.index ?? 'board-home';

        return `/workspace/${encodeURIComponent(workspace)}/${firstMenu}`;
      },
      children: [
        {
          path: ':menu',
          name: 'workspace-menu',
          component: BusinessPage,
        },
      ],
    },
  ],
});
