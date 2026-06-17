import { Routes } from '@angular/router';
import { CatalogList } from './pages/catalog-list/catalog-list';
import { ArticleDetail } from './pages/article-detail/article-detail';
import { ArticleForm } from './pages/article-form/article-form';
import { AuthPage } from './pages/auth/pages/auth/auth';

export const routes: Routes = [
    //1. RUTA POR DEFECTO
    { path: '', redirectTo: 'catalog', pathMatch: 'full' },

    // 2. CATÁLOGO GENERAL
    { path: 'catalog', component: CatalogList },

    // 3. DETALLE DE ARTÍCULO POR ID DINÁMICO
    { path: 'article/:id', component: ArticleDetail },

    // 4. FORMULARIO SUBIR ARTÍCULO
    { path: 'sell-article', component: ArticleForm },

    // 5. LOGIN
    { path: 'login', component: AuthPage },

    // 6. RUTA COMÚN PARA REDIRIGIR
    { path: '**', redirectTo: 'catalog' }
];
