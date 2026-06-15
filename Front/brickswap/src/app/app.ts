import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { ArticleCard } from './shared/components/article-card/article-card';
import { Article } from './core/models/article/article.model';
import { FormTemplate } from './shared/components/form-template/form-template';
import { FilterSidebar } from './shared/components/filter-sidebar/filter-sidebar';
import { AvatarUploader } from './shared/components/avatar-uploader/avatar-uploader';
import { CatalogList } from './pages/catalog-list/catalog-list'; 
import { ArticleForm } from './pages/article-form/article-form';
import { ArticleDetail } from './pages/article-detail/article-detail';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    Navbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'BrickSwap'

}
