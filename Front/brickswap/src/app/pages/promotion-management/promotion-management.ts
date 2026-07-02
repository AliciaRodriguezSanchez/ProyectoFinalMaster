import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { MESSAGE_TEXT } from '../../core/constants/message-text';
import { APP_NAVIGATION_PATHS } from '../../core/constants/user-role';
import { ArticleService } from '../../core/services/article/article.service';
import { UiToastService } from '../../core/services/toast/ui-toast.service';
import { IArticle } from '../../interfaces/iarticles.interface';
import { TableComponent } from '../../shared/table/table.component';
import { PillComponent } from '../../shared/ui/pill/pill.component';
import { SortOrder } from '../../shared/ui/ordenar-lista/ordenar-lista.component';

type PromotionFilter = 'all' | 'promoted';

@Component({
  selector: 'app-promotion-management',
  imports: [FormsModule, TableComponent, PillComponent],
  templateUrl: './promotion-management.html',
  styleUrl: './promotion-management.css',
})
export class PromotionManagement {
  readonly text = MESSAGE_TEXT.promotionManagement;

  articles = signal<IArticle[]>([]);
  visibleArticles = signal<IArticle[]>([]);
  searchText = signal('');
  activePromotionFilter = signal<PromotionFilter>('all');
  sortOrder = signal<SortOrder>('newest');
  isLoading = signal(false);
  promotionFilters: Array<{ label: string; value: PromotionFilter }> = [
    { label: 'Todos', value: 'all' },
    { label: 'En promoción', value: 'promoted' },
  ];

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private toastService: UiToastService
  ) {}

  ngOnInit(): void {
    void this.loadArticles();
  }

  goToAdminHome(): void {
    void this.router.navigateByUrl(APP_NAVIGATION_PATHS.administration);
  }

  updateSearchText(value: string): void {
    this.searchText.set(value);
    this.updateVisibleArticles();
  }

  selectPromotionFilter(filter: string): void {
    this.activePromotionFilter.set(filter as PromotionFilter);
    this.updateVisibleArticles();
  }

  updateSortOrder(): void {
    this.sortOrder.set(this.sortOrder() === 'newest' ? 'oldest' : 'newest');
    this.updateVisibleArticles();
  }

  getSortLabel(): string {
    return this.sortOrder() === 'newest' ? 'Más reciente' : 'Más antiguo';
  }

  async loadArticles(): Promise<void> {
    this.isLoading.set(true);

    try {
      const articles = await firstValueFrom(this.articleService.getArticles());
      this.articles.set(articles);
      this.updateVisibleArticles();
    } catch (error) {
      console.error(error);
      this.toastService.error(this.text.loadError);
    } finally {
      this.isLoading.set(false);
    }
  }

  async updatePromotion(event: { id: number; inPromotion: boolean }): Promise<void> {
    const previousArticles = this.articles();

    this.articles.update((articles) =>
      articles.map((article) =>
        article.id === event.id
          ? { ...article, in_promotion: event.inPromotion ? 1 : 0 }
          : article
      )
    );
    this.updateVisibleArticles();

    try {
      await this.articleService.updatePromotion(event.id, event.inPromotion);
      this.toastService.success(this.text.updateSuccess);
    } catch (error) {
      console.error(error);
      this.articles.set(previousArticles);
      this.updateVisibleArticles();
      this.toastService.error(this.text.updateError);
    }
  }

  private updateVisibleArticles(): void {
    const normalizedSearch = this.searchText().trim().toLowerCase();

    const articles = this.articles()
      .filter((article) => {
        if (
          this.activePromotionFilter() === 'promoted' &&
          !this.isArticleInPromotion(article)
        ) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        const title = article.titulo?.toLowerCase() || '';
        const id = String(article.id || '');

        return title.includes(normalizedSearch) || id.includes(normalizedSearch);
      })
      .sort((firstArticle, secondArticle) => {
        const firstId = Number(firstArticle.id) || 0;
        const secondId = Number(secondArticle.id) || 0;

        return this.sortOrder() === 'newest'
          ? secondId - firstId
          : firstId - secondId;
      });

    this.visibleArticles.set(articles);
  }

  private isArticleInPromotion(article: IArticle): boolean {
    return article.in_promotion === true || article.in_promotion === 1;
  }
}
