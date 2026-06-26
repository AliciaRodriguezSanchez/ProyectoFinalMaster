import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiCarrouselComponent } from '../../shared/components/carrousel/carrousel.component';
import { UiCarrouselItem } from '../../shared/components/carrousel/carrousel.interface';
import { UiProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { UiCategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { PromotionBannerComponent } from '../../shared/components/promotion-banner/promotion-banner.component';
import { UiInfoCardComponent } from '../../shared/components/info-card/info-card.component';
import { CATEGORY_STYLES, HOME_FEATURES } from './home-features';
import { APP_ASSETS } from '../../core/constants/app-assets';
import { MESSAGE_TEXT } from '../../core/constants/message-text';
import { CategoryService } from '../../core/services/category/category.service';
import { ICategory } from '../../core/interfaces/icategory.interface';
import { UiToastService } from '../../core/services/toast/ui-toast.service';
import { ArticleService } from '../../core/services/article/article.service';
import { IArticle } from '../../core/interfaces/iarticles.interface';


@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    PromotionBannerComponent,
    UiCarrouselComponent,
    UiCategoryCardComponent,
    UiProductCardComponent,
    UiInfoCardComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  heroImageUrl = APP_ASSETS.homeBackground;
  categoryServices = inject(CategoryService);
  articlesServices = inject(ArticleService)
  toastService = inject(UiToastService);
  categories = signal<ICategory[]>([]);
  popularProducts = signal<IArticle[]>([]);
  promotionProducts = signal<IArticle[]>([]);
  isLoadingCategories = signal(true);
  isLoadingLastProduct = signal(true);
  isLoadingProductsInPromotion = signal(true);
  categoryItems = computed<UiCarrouselItem[]>(() =>
    this.categories().map((category, index) => {
      const style = CATEGORY_STYLES[index % CATEGORY_STYLES.length];

      return {
        id: category.id,
        icon: style.icon,
        color: style.color,
        text: category.nombre,
      };
    })
  );
  features = HOME_FEATURES;

  ngOnInit(): void {
    this.loadCategories();
    this.loadLatestProducts();
    this.loadProductsInPromotion();
  }

  async loadCategories(): Promise<void> {
    this.isLoadingCategories.set(true);
    try {
      const response = await this.categoryServices.getCategories();
      this.categories.set(response);
    } catch (error: unknown) {
      this.toastService.error(MESSAGE_TEXT.home.categoriesLoadError);
    } finally {
      this.isLoadingCategories.set(false);
    }
  }
  async loadLatestProducts(): Promise<void> {
    this.isLoadingLastProduct.set(true);

    try {
      const response = await this.articlesServices.getLastArticles();
      this.popularProducts.set(response);
    } catch (error: unknown) {
      this.toastService.error(MESSAGE_TEXT.home.latestProductsLoadError);
    } finally {
      this.isLoadingLastProduct.set(false);
    }
  }

  async loadProductsInPromotion(): Promise<void> {
    this.isLoadingProductsInPromotion.set(true);

    try {
      const response = await this.articlesServices.getArticlesInPromotions();
      this.promotionProducts.set(response);
    } catch (error: unknown) {
      this.toastService.error(MESSAGE_TEXT.home.promotionProductsLoadError);
    } finally {
      this.isLoadingProductsInPromotion.set(false);
    }
  }

  /*latestProducts: HomeProduct[] = [
    {
      id: 1,
      imageUrl: APP_ASSETS.loginBricks,
      title: 'LEGO Harry Potter Castillo de Hogwarts 71043',
      price: 289.99,
      location: 'Madrid, España',
      publishedAt: '2026-06-16T08:30:00.000Z',
      condition: 'Como nuevo',
      badgeText: 'Disponible',
    },
    {
      id: 2,
      imageUrl: APP_ASSETS.loginBricks,
      title: 'LEGO Harry Potter 71043 Castillo de Hogwarts',
      price: 320,
      location: 'Bilbao',
      publishedAt: '2026-05-08T08:30:00.000Z',
      condition: 'Buen estado',
      badgeText: 'Disponible',
    },
    {
      id: 3,
      imageUrl: APP_ASSETS.loginBricks,
      title: 'LEGO Architecture 21054 La Casa Blanca',
      price: 75,
      location: 'Málaga',
      publishedAt: '2026-06-11T08:30:00.000Z',
      condition: 'Nuevo',
      badgeText: 'Reservado',
    },
  ];*/

  /*popularProducts: HomeProduct[] = [
    ...this.latestProducts,
  ];*/

 
}
