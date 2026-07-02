import { Routes } from '@angular/router';
import { CatalogList } from './pages/catalog-list/catalog-list';
import { ArticleDetail } from './pages/article-detail/article-detail';
import { ArticleForm } from './pages/article-form/article-form';
import { AuthPage } from './pages/auth/pages/auth/auth';
import { Register } from './pages/register/register';
import { Home } from './interfaces/home';
import { ModeradorPage } from './pages/moderador/moderador';
import { AdminPage } from './pages/admin/admin';
import { CategoryManagement } from './pages/category-management/category-management';
import { UserPanelPage } from './pages/user-panel/user-panel';
import { ProfilePage } from './pages/profile/profile';
import { roleGuard } from './core/guards/role.guard';
import { APP_ROUTE_PATHS, AUTHENTICATED_USER_ROLES, UserRole } from './core/constants/user-role';
import { Error404 } from './pages/error404/error404';

export const routes: Routes = [
    //1. RUTA POR DEFECTO
    { path: '', redirectTo: APP_ROUTE_PATHS.home, pathMatch: 'full' },

    // 2. HOME
    { path: APP_ROUTE_PATHS.home, component: Home },

    // 3. CATÁLOGO GENERAL
    { path: APP_ROUTE_PATHS.catalog, component: CatalogList },
    { path: APP_ROUTE_PATHS.categories, component: CatalogList },

    // 4. DETALLE DE ARTÍCULO POR ID DINÁMICO
    { path: APP_ROUTE_PATHS.articleDetail, component: ArticleDetail },

    // 5. FORMULARIO SUBIR ARTÍCULO
    { path: APP_ROUTE_PATHS.sellArticle, component: ArticleForm },

    // 6. LOGIN
    { path: APP_ROUTE_PATHS.login, component: AuthPage },

    // 7. REGISTER
    { path: APP_ROUTE_PATHS.register, component: Register },

    // 8. MI PANEL
    {
      path: APP_ROUTE_PATHS.myPanel,
      canActivate: [roleGuard],
      data: {
        roles: [UserRole.USER]
      },
      component: UserPanelPage
    },

    // 9. MENSAJES
    {
        path: APP_ROUTE_PATHS.messages,
        canActivate: [roleGuard],
        data: {
            roles: AUTHENTICATED_USER_ROLES
        },
        loadChildren: () => import('./pages/messages/messages.routes').then((m) => m.MESSAGES_ROUTES)
    },

    // 10. PERFIL
    {
        path: APP_ROUTE_PATHS.profile,
        canActivate: [roleGuard],
        data: {
            roles: AUTHENTICATED_USER_ROLES
        },
        component: ProfilePage
    },

    // 11. MODERADOR
    { path: APP_ROUTE_PATHS.moderator,
        canActivate: [roleGuard],
        data: {
            roles: [UserRole.ADMIN, UserRole.MODERATOR]
        },
        component: ModeradorPage,
    },

    // 12. ADMINISTRACION
    { path: APP_ROUTE_PATHS.administration,
        canActivate: [roleGuard],
        data: {
            roles: [UserRole.ADMIN]
        },
        component: AdminPage
    },
    {
        path: APP_ROUTE_PATHS.administrationUsers,
        canActivate: [roleGuard],
        data: {
            roles: [UserRole.ADMIN]
        },
        component: AdminPage
    },
    {
        path: APP_ROUTE_PATHS.administrationCategories,
        canActivate: [roleGuard],
        data: {
            roles: [UserRole.ADMIN]
        },
        component: CategoryManagement
    },
    {
        path: APP_ROUTE_PATHS.administrationModerator,
        canActivate: [roleGuard],
        data: {
            roles: [UserRole.ADMIN, UserRole.MODERATOR]
        },
        component: ModeradorPage
    },

    // 13. RUTA COMÚN PARA REDIRIGIR
    { path: '**', redirectTo: APP_ROUTE_PATHS.home }
];
