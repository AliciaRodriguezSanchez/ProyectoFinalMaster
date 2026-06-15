import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Article, Category } from "../../models/article/article.model";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  // URL BASE DE NODE
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // 1. GET /api/categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  // 2. GET /api/articles
  getArticles(search?: string, categoryId?: number): Observable<Article[]> {
    let url = `${this.apiUrl}/articles`;

    const params: string[] = [];
    if (search) params.push(`search=${search}`);
    if (categoryId) params.push(`category=${categoryId}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return this.http.get<Article[]>(url);
  }

  // 3. GET /api/articles/:id
  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/articles/${id}`);
  }

  // 4. POST /api/articles
  createArticle(article: Article): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/articles`, article);
  }

  // 5. PUT /api/articles/:id/reserve
  reserveArticle(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/articles/${id}/reserve`, {});
  }

  // 6. PUT /api/articles/:id/buy
  buyArticle(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/articles/${id}/buy`, {});
  }

  // 7. POST /api/articles/:id/favorites
  addToFavorites(articuloId: number, perfilId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/favorites`, { 
      articulo_id: articuloId, 
      perfil_id: perfilId 
    });
  }
}
