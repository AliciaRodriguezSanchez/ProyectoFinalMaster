import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Article } from '../../../core/models/article/article.model';

@Component({
  selector: 'app-article-card',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './article-card.html',
  styleUrl: './article-card.css',
})
export class ArticleCard {
  @Input() article!: Article;
}
