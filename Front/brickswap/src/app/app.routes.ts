import { Routes } from '@angular/router';
import { CatalogList } from './pages/catalog-list/catalog-list';
import { ArticleDetail } from './pages/article-detail/article-detail';
import { ArticleForm } from './pages/article-form/article-form';
import { AuthPage } from './pages/auth/pages/auth/auth';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { ModeradorPage } from './pages/moderador/moderador';
import { AdminPage } from './pages/admin/admin';
import { UserPanelPage } from './pages/user-panel/user-panel';
import { MessagesPage } from './pages/messages/messages';
import { ProfilePage } from './pages/profile/profile';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/constants/user-role';

export const routes: Routes = [
    //1. RUTA POR DEFECTO
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    // 2. HOME
    { path: 'home', component: Home },

    // 3. CATÁLOGO GENERAL
    { path: 'catalog', component: CatalogList },
    { path: 'categories', component: CatalogList },

    // 4. DETALLE DE ARTÍCULO POR ID DINÁMICO
    { path: 'article/:id', component: ArticleDetail },

    // 5. FORMULARIO SUBIR ARTÍCULO
    { path: 'sell-article', component: ArticleForm },

    // 6. LOGIN
    { path: 'login', component: AuthPage },

    // 7. REGISTER
    { path: 'register', component: Register },

    // 6. RUTA COMÚN PARA REDIRIGIR
    { path: '**', redirectTo: 'catalog' },
    // 8. MI PANEL
    {
        path: 'my-panel',
        canActivate: [roleGuard],
        data: {
            roles: [UserRole.USER]
        },
        component: UserPanelPage
    },

    // 9. MENSAJES
    {
        path: 'messages',
        canActivate: [roleGuard],
        data: {
            roles: [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN]
        },
        component: MessagesPage
    },

    // 10. PERFIL
    {
        path: 'profile',
        canActivate: [roleGuard],
        data: {
            roles: [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN]
        },
        component: ProfilePage
    },

    // 11. MODERADOR
    { path: 'moderador',
        canActivate: [roleGuard],
        data: {
            roles: [UserRole.MODERATOR]
        },
        component: ModeradorPage,  
    },

    // 12. ADMINISTRACION
    { path: 'administration',  
        canActivate: [roleGuard],
        data: {
            roles: [UserRole.ADMIN]
        },
        component: AdminPage 
    },

    // 13. RUTA COMÚN PARA REDIRIGIR
    { path: '**', redirectTo: 'home' }
];
