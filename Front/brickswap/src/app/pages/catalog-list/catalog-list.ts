import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterSidebar } from '../../shared/components/filter-sidebar/filter-sidebar';
import { UiProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Article } from '../../core/models/article/article.model';
import { ArticleService } from '../../core/services/article/article.service';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterSidebar, UiProductCardComponent],
  templateUrl: './catalog-list.html',
  styleUrl: './catalog-list.css'
})
export class CatalogList implements OnInit {
  
  // ARRAY PRINCIPAL
  articles: Article[] = [];
  filteredArticles = signal<Article[]>([]);
  isLoading = signal(false);
  filtersApplied = signal(false);

  searchKeyword: string = '';
  selectedCategory: string = '';
  selectedCondition: string = '';
  maxPrice: number = 1000;

  // INYECCIÓN DEL SERVICIO
  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.loadBackendArticles();
  }

  // CARGA INICIAL
  loadBackendArticles() {
    this.isLoading.set(true);

    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.showAllArticles();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error al absorber los artículos de la API:', err);
        this.isLoading.set(false);
      }
    });
  }

  onApplyCatalogFilters(keyword: string) {
    this.searchKeyword = keyword;
    this.filtersApplied.set(true);
    this.applyCatalogFilters();
  }

  onResetCatalog() {
    this.searchKeyword = '';
    this.selectedCategory = '';
    this.selectedCondition = '';
    this.maxPrice = 1000;
    this.filtersApplied.set(false);
    this.showAllArticles();
  }

  showAllArticles() {
    this.filteredArticles.set([...this.articles]);
  }

  applyCatalogFilters() {
    const filteredArticles = this.articles.filter(article => {
      const matchKeyword = article.titulo.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const matchCategory = this.selectedCategory === '' || article.categoria_id === Number(this.selectedCategory);
      const matchCondition = this.selectedCondition === '' || article.estado_articulo === this.selectedCondition;
      const matchPrice = article.precio <= this.maxPrice;

      return matchKeyword && matchCategory && matchCondition && matchPrice;
    });

    this.filteredArticles.set(filteredArticles);
  }
}
