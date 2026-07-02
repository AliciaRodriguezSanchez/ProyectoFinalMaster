import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArticleService } from '../../core/services/article/article.service';
import { AuthService } from '../../core/services/auth/auth.service';
import type { IArticle } from '../../interfaces/iarticles.interface';
import { TitleComponent } from '../../shared/ui/titles/title.component';
import { DescriptionsComponent } from '../../shared/ui/descriptions/descriptions.component';

type ManagementTab = 'selling' | 'sold' | 'favorites' | 'drafts';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, RouterLink, TitleComponent, DescriptionsComponent],
  templateUrl: './user-panel.html',
  styleUrl: './user-panel.css',
})
export class UserPanelPage implements OnInit {

  articles: IArticle[] = [];
  favoriteArticles: IArticle[] = [];

  activeTab: ManagementTab = 'selling';

  isLoading = false;
  errorMessage = '';

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserArticles();
  }

  async loadUserArticles(): Promise<void> {
      const profileId = this.authService.getCurrentUserId();

      if (profileId === null) {
        this.errorMessage = 'No se pudo identificar al usuario actual';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      try {
          const [articles, favorites] = await Promise.all([
            this.articleService.getArticlesByProfileId(profileId),
            this.articleService.getFavoritesByProfileId(profileId)
          ]);

          this.articles = articles;
          this.favoriteArticles = favorites;

        console.log('Artículos del panel:', this.articles);
      } catch (error) {
        console.error('Error al cargar las gestiones:', error);
        this.errorMessage = 'No se pudieron cargar tus artículos';
      } finally {
        this.isLoading = false;

        // Actualiza la vista cuando la petición ya ha terminado
        this.changeDetectorRef.detectChanges();
      }
  }

  selectTab(tab: ManagementTab): void {
    this.activeTab = tab;
  }

  get sellingArticles(): IArticle[] {
    return this.articles.filter(
      article =>
        article.estado_venta === 'Disponible' &&
        article.estado_revision === 'Publicado'
    );
  }

  get soldArticles(): IArticle[] {
    return this.articles.filter(
      article => article.estado_venta === 'Vendido'
    );
  }

  get draftArticles(): IArticle[] {
    return this.articles.filter(
      article =>
        article.estado_revision === 'Borrador'
    );
  }

  get visibleArticles(): IArticle[] {
    switch (this.activeTab) {
      case 'sold':
        return this.soldArticles;

      case 'drafts':
        return this.draftArticles;

      case 'favorites':
        return this.favoriteArticles;

      case 'selling':
      default:
        return this.sellingArticles;
    }
  }

  get activeTabTitle(): string {
    const titles: Record<ManagementTab, string> = {
      selling: 'Artículos en venta',
      sold: 'Artículos vendidos',
      favorites: 'Artículos favoritos',
      drafts: 'Borradores',
    };

    return titles[this.activeTab];
  }
}
