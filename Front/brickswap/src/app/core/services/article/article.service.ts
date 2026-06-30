import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, firstValueFrom } from "rxjs";
import { Article } from "../../models/article/article.model";
import { ICategory } from "../../../interfaces/icategory.interface";
import { IArticle } from "../../../interfaces/iarticles.interface";
import { API_URL , ARTICLES, LAST_PUBLICATIONS, IN_PROMOTIONS} from "../api";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(private http: HttpClient) { }

  // 1. GET /api/categories
  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${API_URL}/categories`);
  }

  // 2. GET /api/articles
  getArticles(search?: string, categoryId?: number): Observable<Article[]> {
    let url = `${API_URL}/articles`;

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
    return this.http.get<Article>(`${API_URL}/articles/${id}`);
  }

  // 4. POST /api/articles
  createArticle(article: Article): Observable<any> {
    return this.http.post<any>(`${API_URL}/articles`, article);
  }

  // 5. PUT /api/articles/:id/reserve
  reserveArticle(id: number): Observable<any> {
    return this.http.put<any>(`${API_URL}/articles/${id}/reserve`, {});
  }

  // 6. PUT /api/articles/:id/buy
  buyArticle(id: number): Observable<any> {
    return this.http.put<any>(`${API_URL}/articles/${id}/buy`, {});
  }

  // 7. POST /api/articles/:id/favorites
  addToFavorites(articuloId: number, perfilId: number): Observable<any> {
    return this.http.post<any>(`${API_URL}/favorites`, {
      articulo_id: articuloId,
      perfil_id: perfilId
    });
  }


  // 8. GET ultimas publicaciones
  getLastArticles(): Promise<IArticle[]> {
    return firstValueFrom(
      this.http.get<IArticle[]>(`${API_URL}/${ARTICLES}/${LAST_PUBLICATIONS}`)
    );
  }

   // 9. GET articulos en promocion
  getArticlesInPromotions(): Promise<IArticle[]> {
    return firstValueFrom(
      this.http.get<IArticle[]>(`${API_URL}/${ARTICLES}/${IN_PROMOTIONS}`)
    );
  }

  // 10. GET artículos de un usuario
  getArticlesByProfileId(profileId: number): Promise<IArticle[]> {
    return firstValueFrom(
      this.http.get<IArticle[]>(
        `${API_URL}/articles/profile/${profileId}`
      )
    );
  }

    // 11. GET favoritos de un usuario
  getFavoritesByProfileId(profileId: number): Promise<IArticle[]> {
    return firstValueFrom(
      this.http.get<IArticle[]>(
        `${API_URL}/favorites/profile/${profileId}`
      )
    );
  }

}
