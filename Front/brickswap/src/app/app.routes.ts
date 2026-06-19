import { Routes } from '@angular/router';
import { CatalogList } from './pages/catalog-list/catalog-list';
import { ArticleDetail } from './pages/article-detail/article-detail';
import { ArticleForm } from './pages/article-form/article-form';
import { AuthPage } from './pages/auth/pages/auth/auth';
import { Home } from './pages/home/home';
import { ModeradorPage } from './pages/moderador/moderador';
import { AdminPage } from './pages/admin/admin';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/constants/user-role';

export const routes: Routes = [
    //1. RUTA POR DEFECTO
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    // 2. HOME
    { path: 'home', component: Home },

    // 3. CATÁLOGO GENERAL
    { path: 'catalog', component: CatalogList },

    // 4. DETALLE DE ARTÍCULO POR ID DINÁMICO
    { path: 'article/:id', component: ArticleDetail },

    // 5. FORMULARIO SUBIR ARTÍCULO
    { path: 'sell-article', component: ArticleForm },

    // 6. LOGIN
    { path: 'login', component: AuthPage },

    // 7. MODERADOR
    { path: 'moderador',
        canActivate: [roleGuard],
        data: {
            roles: [UserRole.MODERATOR]
        },
        component: ModeradorPage,  
    },

    // 8. ADMINISTRACION
    { path: 'administration',  
        canActivate: [roleGuard],
        data: {
            roles: [UserRole.ADMIN]
        },
        component: AdminPage 
    },

    // 9. RUTA COMÚN PARA REDIRIGIR
    { path: '**', redirectTo: 'home' }
];
