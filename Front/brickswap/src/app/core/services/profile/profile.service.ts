import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TOKEN_KEY } from '../../constants/auth';
import { API_URL } from '../api';

export interface ProfileStats {
  totalArticles: number;
  publishedArticles: number;
  soldArticles: number;
  favoriteArticles: number;
}

export interface RatingLine {
  stars: number;
  count: number;
}

export interface ProfileReview {
  id: number;
  rating: number;
  comentario: string | null;
  fecha_valoracion: string;
  authorName: string;
  authorLastName: string;
  authorUsername: string;
  articleTitle: string | null;
}

export interface ProfileData {
  id: number;
  name: string;
  lastname: string;
  username: string;
  email: string;
  registerDate: string;
  averageRating: number;
  reviewCount: number;
  photoUrl: string | null;
  status: string;
  roleId: number;
  ratingLines: RatingLine[];
  reviews: ProfileReview[];
  stats: ProfileStats;
}

export interface ProfileUpdateData {
  name: string;
  lastname: string;
  username: string;
  email: string;
  photoUrl: string;
}

export interface PasswordCheckData {
  currentPassword: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
}

export interface ProfileUpdateResponse {
  message: string;
  profile: ProfileData;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(): Promise<ProfileData> {
    return firstValueFrom(
      this.http.get<ProfileData>(`${API_URL}/profile/me`, {
        headers: this.getHeaders(),
      })
    );
  }

  updateProfile(profileData: ProfileUpdateData): Promise<ProfileUpdateResponse> {
    return firstValueFrom(
      this.http.put<ProfileUpdateResponse>(`${API_URL}/profile/me`, profileData, {
        headers: this.getHeaders(),
      })
    );
  }

  checkPassword(passwordData: PasswordCheckData): Promise<{ message: string }> {
    return firstValueFrom(
      this.http.post<{ message: string }>(`${API_URL}/profile/check-password`, passwordData, {
        headers: this.getHeaders(),
      })
    );
  }

  changePassword(passwordData: PasswordChangeData): Promise<{ message: string }> {
    return firstValueFrom(
      this.http.patch<{ message: string }>(`${API_URL}/profile/password`, passwordData, {
        headers: this.getHeaders(),
      })
    );
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(TOKEN_KEY) || '';

    return new HttpHeaders({
      Authorization: token,
    });
  }
}
