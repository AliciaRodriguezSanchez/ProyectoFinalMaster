import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterSidebar } from '../../shared/components/filter-sidebar/filter-sidebar';
import { ArticleCard } from '../../shared/components/article-card/article-card';
import { Article } from '../../core/models/article/article.model';
import { ArticleService } from '../../core/services/article/article.service';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterSidebar, ArticleCard],
  templateUrl: './catalog-list.html',
  styleUrl: './catalog-list.css'
})
export class CatalogList implements OnInit {
  
  // ARRAY PRINCIPAL
  articles: Article[] = [];
  filteredArticles: Article[] = [];

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
    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.applyCatalogFilters(); // FILTROS INICIALES
      },
      error: (err) => {
        console.error('❌ Error al absorber los artículos de la API:', err);
      }
    });
  }

  onSearchChange(keyword: string) {
    this.searchKeyword = keyword;
    this.applyCatalogFilters();
  }

  onResetCatalog() {
    this.searchKeyword = '';
    this.selectedCategory = '';
    this.selectedCondition = '';
    this.maxPrice = 1000;
    this.applyCatalogFilters();
  }

  applyCatalogFilters() {
    this.filteredArticles = this.articles.filter(article => {
      const matchKeyword = article.titulo.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const matchCategory = this.selectedCategory === '' || article.categoria_id === Number(this.selectedCategory);
      const matchCondition = this.selectedCondition === '' || article.estado_articulo === this.selectedCondition;
      const matchPrice = article.precio <= this.maxPrice;

      return matchKeyword && matchCategory && matchCondition && matchPrice;
    });
  }
}
