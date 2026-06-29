import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TOKEN_KEY } from '../../core/constants/auth';
import {
  PasswordChangeData,
  ProfileData,
  ProfileReview,
  ProfileService,
  ProfileUpdateData,
} from '../../core/services/profile/profile.service';
import { UiRatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, UiRatingStarsComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage implements OnInit {
  profile: ProfileData | null = null;
  loading = true;
  savingProfile = false;
  savingPassword = false;
  checkingPassword = false;
  editModalOpen = false;
  passwordFormOpen = false;
  currentPasswordOk = false;
  errorMessage = '';
  successMessage = '';
  modalMessage = '';
  passwordMessage = '';
  visibleReviewsCount = 5;

  editForm: ProfileUpdateData = this.getEmptyEditForm();

  passwordForm: PasswordChangeData = {
    currentPassword: '',
    newPassword: '',
    repeatPassword: '',
  };

  private successMessageTimer: ReturnType<typeof setTimeout> | null = null;
  private passwordCheckTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      this.profile = await this.profileService.getProfile();
      this.visibleReviewsCount = 5;
    } catch (error) {
      if (this.isAuthError(error)) {
        this.redirectToLogin();
        return;
      }

      this.errorMessage = this.getErrorMessage(error, 'No se pudo cargar el perfil');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  openEditModal(): void {
    if (!this.profile) {
      return;
    }

    this.editForm = {
      name: this.profile.name,
      lastname: this.profile.lastname,
      username: this.profile.username,
      email: this.profile.email,
      photoUrl: this.profile.photoUrl || '',
    };

    this.successMessage = '';
    this.modalMessage = '';
    this.passwordMessage = '';
    this.resetPasswordForm();
    this.editModalOpen = true;
  }

  closeEditModal(): void {
    this.editModalOpen = false;
    this.resetPasswordForm();
  }

  async saveProfile(): Promise<void> {
    if (this.formIsInvalid) {
      return;
    }

    this.savingProfile = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.modalMessage = '';

    try {
      const response = await this.profileService.updateProfile({
        name: this.editForm.name.trim(),
        lastname: this.editForm.lastname.trim(),
        username: this.editForm.username.trim(),
        email: this.editForm.email.trim(),
        photoUrl: this.editForm.photoUrl.trim(),
      });

      if (this.currentPasswordOk && this.passwordForm.newPassword) {
        await this.profileService.changePassword(this.passwordForm);
      }

      this.profile = response.profile;
      localStorage.setItem(TOKEN_KEY, response.token);
      this.showSuccessMessage(response.message);
      this.editModalOpen = false;
    } catch (error) {
      if (this.isAuthError(error)) {
        this.redirectToLogin();
        return;
      }

      this.modalMessage = this.getErrorMessage(error, 'No se pudieron guardar los cambios');
    } finally {
      this.savingProfile = false;
      this.cdr.detectChanges();
    }
  }

  showPasswordForm(): void {
    this.passwordFormOpen = true;
    this.passwordMessage = '';
    this.currentPasswordOk = false;
  }

  onCurrentPasswordChange(): void {
    this.currentPasswordOk = false;
    this.passwordMessage = '';
    this.passwordForm.newPassword = '';
    this.passwordForm.repeatPassword = '';

    if (this.passwordCheckTimer) {
      clearTimeout(this.passwordCheckTimer);
    }

    if (!this.passwordForm.currentPassword.trim()) {
      this.checkingPassword = false;
      return;
    }

    const currentPassword = this.passwordForm.currentPassword;

    this.passwordCheckTimer = setTimeout(() => {
      this.checkCurrentPassword(currentPassword);
    }, 600);
  }

  async checkCurrentPassword(currentPassword = this.passwordForm.currentPassword): Promise<void> {
    if (!currentPassword.trim()) {
      return;
    }

    this.checkingPassword = true;
    this.passwordMessage = '';

    try {
      await this.profileService.checkPassword({ currentPassword });

      if (currentPassword !== this.passwordForm.currentPassword) {
        return;
      }

      this.currentPasswordOk = true;
    } catch (error) {
      if (this.isAuthError(error)) {
        this.redirectToLogin();
        return;
      }

      if (currentPassword === this.passwordForm.currentPassword) {
        this.currentPasswordOk = false;
        this.passwordMessage = '';
      }
    } finally {
      if (currentPassword === this.passwordForm.currentPassword) {
        this.checkingPassword = false;
        this.cdr.detectChanges();
      }
    }
  }

  async savePassword(): Promise<void> {
    if (!this.passwordForm.newPassword || !this.passwordForm.repeatPassword) {
      this.passwordMessage = 'Introduce la nueva contraseña dos veces';
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.repeatPassword) {
      this.passwordMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.savingPassword = true;

    try {
      const response = await this.profileService.changePassword(this.passwordForm);
      this.passwordMessage = response.message;
      this.resetPasswordForm();
    } catch (error) {
      if (this.isAuthError(error)) {
        this.redirectToLogin();
        return;
      }

      this.passwordMessage = this.getErrorMessage(error, 'No se pudo cambiar la contraseña');
    } finally {
      this.savingPassword = false;
      this.cdr.detectChanges();
    }
  }

  getFullName(profile: ProfileData): string {
    return `${profile.name} ${profile.lastname}`;
  }

  getInitials(profile: ProfileData): string {
    const firstInitial = profile.name.trim().charAt(0);
    const secondInitial = profile.lastname.trim().charAt(0) || profile.username.trim().charAt(0);

    return `${firstInitial || 'U'}${secondInitial || ''}`.toUpperCase();
  }

  getRoleName(profile: ProfileData): string {
    const roles: Record<number, string> = {
      1: 'usuario',
      2: 'moderador',
      3: 'administrador',
    };

    return roles[profile.roleId] || 'usuario';
  }

  getFormattedDate(date: string): string {
    const profileDate = new Date(date);

    if (Number.isNaN(profileDate.getTime())) {
      return date;
    }

    return profileDate.toLocaleDateString('es-ES');
  }

  getReviewDate(date: string): string {
    const reviewDate = new Date(date);

    if (Number.isNaN(reviewDate.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(reviewDate);
  }

  getRatingPercent(count: number): number {
    if (!this.profile?.reviewCount) {
      return 0;
    }

    return (count / this.profile.reviewCount) * 100;
  }

  showReviews(profile: ProfileData): boolean {
    return profile.roleId === 1;
  }

  showMoreReviews(): void {
    this.visibleReviewsCount = this.profile?.reviews.length || 5;
  }

  get visibleReviews(): ProfileReview[] {
    return this.profile?.reviews.slice(0, this.visibleReviewsCount) || [];
  }

  get hasMoreReviews(): boolean {
    return Boolean(this.profile && this.visibleReviewsCount < this.profile.reviews.length);
  }

  get passwordsDontMatch(): boolean {
    return Boolean(
      this.passwordForm.newPassword &&
        this.passwordForm.repeatPassword &&
        this.passwordForm.newPassword !== this.passwordForm.repeatPassword
    );
  }

  get passwordChangeIsIncomplete(): boolean {
    const hasStarted = Boolean(this.passwordForm.newPassword || this.passwordForm.repeatPassword);

    return Boolean(
      this.currentPasswordOk &&
        hasStarted &&
        (!this.passwordForm.newPassword || !this.passwordForm.repeatPassword)
    );
  }

  get formIsInvalid(): boolean {
    return Boolean(
      !this.editForm.name.trim() ||
        !this.editForm.lastname.trim() ||
        !this.editForm.email.trim() ||
        this.passwordsDontMatch ||
        this.passwordChangeIsIncomplete
    );
  }

  onProfileImageError(): void {
    if (this.profile) {
      this.profile.photoUrl = null;
    }
  }

  private resetPasswordForm(): void {
    if (this.passwordCheckTimer) {
      clearTimeout(this.passwordCheckTimer);
    }

    this.passwordFormOpen = false;
    this.currentPasswordOk = false;
    this.checkingPassword = false;
    this.passwordMessage = '';
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
    };
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;

    if (this.successMessageTimer) {
      clearTimeout(this.successMessageTimer);
    }

    this.successMessageTimer = setTimeout(() => {
      this.successMessage = '';
      this.successMessageTimer = null;
      this.cdr.detectChanges();
    }, 2000);
  }

  private getEmptyEditForm(): ProfileUpdateData {
    return {
      name: '',
      lastname: '',
      username: '',
      email: '',
      photoUrl: '',
    };
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (this.hasErrorMessage(error)) {
      return error.error.message;
    }

    return fallback;
  }

  private isAuthError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null || !('status' in error)) {
      return false;
    }

    const httpError = error as { status?: unknown };

    return httpError.status === 401 || httpError.status === 403;
  }

  private redirectToLogin(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  private hasErrorMessage(error: unknown): error is { error: { message: string } } {
    if (typeof error !== 'object' || error === null || !('error' in error)) {
      return false;
    }

    const httpError = error as { error?: { message?: unknown } };

    return typeof httpError.error?.message === 'string';
  }
}
