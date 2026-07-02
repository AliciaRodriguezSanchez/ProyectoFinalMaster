import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormTemplate } from '../../shared/components/form-template/form-template';
import { UiButtonComponent } from '../../shared/ui/button/ui-button.component';
import { UiInputComponent } from '../../shared/ui/input/ui-input.component';
import { UiSelectComponent, UiSelectOption } from '../../shared/ui/select/ui-select.component';
import { UiTextareaComponent } from '../../shared/ui/textarea/ui-textarea.component';
import { ArticleService } from '../../core/services/article/article.service';
import { CategoryService } from '../../core/services/category/category.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { MESSAGE_TEXT } from '../../core/constants/message-text';
import { UiToastService } from '../../core/services/toast/ui-toast.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormTemplate,
    UiButtonComponent,
    UiInputComponent,
    UiSelectComponent,
    UiTextareaComponent,
  ],
  templateUrl: './article-form.html',
  styleUrl: './article-form.css',
})
export class ArticleForm {
  articleForm!: FormGroup;
  readonly text = MESSAGE_TEXT;
  categoryOptions = signal<UiSelectOption[]>([]);
  readonly conditionOptions: UiSelectOption[] = [
    { label: 'Nuevo', value: 'Nuevo' },
    { label: 'Como nuevo', value: 'Como nuevo' },
    { label: 'Buen estado', value: 'Buen estado' },
    { label: 'Aceptable', value: 'Aceptable' },
  ];

  imagePreview: string | null = null;

  // 1. INYECCION DE ROUTER Y SERVICIO
  constructor (
    private fb: FormBuilder,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
    private toastService: UiToastService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    void this.loadCategories();
  }


  // 2. INICIALIZACIÓN FORMULARIO
  private initForm() {
    this.articleForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(15)]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      estado_articulo: ['', [Validators.required]],
      categoria_id: ['', [Validators.required]],
      foto: ['', [
        Validators.required,
        Validators.maxLength(200),
        Validators.pattern(/^https?:\/\/\S+$/),
      ]],
      estado_revision: ['Borrador'],
      perfil_id: [this.authService.getCurrentUserId()]
    });
  }

  // 3. CAPTURAR FOTO PARA FORMULARIO
  onUrlChange(event: any) {
  const url = event.target.value;
  this.imagePreview = url;
  this.articleForm.patchValue({ foto: url });
  }

  updateDescription(value: string): void {
    this.articleForm.patchValue({ descripcion: value });
    this.articleForm.get('descripcion')?.markAsTouched();
  }

  async loadCategories(): Promise<void> {
    try {
      const categories = await this.categoryService.getCategories();

      this.categoryOptions.set(
        categories
          .filter((category) => category.id !== undefined)
          .map((category) => ({
            label: category.nombre,
            value: category.id!,
          }))
      );
    } catch (error) {
      console.error(error);
      this.toastService.error(MESSAGE_TEXT.articleForm.categoriesLoadError);
    }
  }

  // 4. MÉTODO PARA PROCESAR FORMULARIO
  submitForm(targetState: 'Borrador' | 'Publicado') {
    const profileId = this.authService.getCurrentUserId();

    if (profileId === null) {
      this.toastService.warning(MESSAGE_TEXT.articleForm.loginRequired);
      return;
    }

    this.articleForm.patchValue({
      estado_revision: targetState,
      perfil_id: profileId,
    });

    if (this.articleForm.valid) {
      // 5. LLAMADA A LA API
      const { perfil_id, ...articlePayload } = this.articleForm.value;
      const formValue = {
        ...articlePayload,
        categoria_id: Number(this.articleForm.value.categoria_id),
      }
      this.articleService.createArticle(formValue).subscribe({
        next: (response) => {
          console.log(' Artículo subido a Brickswap:', response);
          this.toastService.success(MESSAGE_TEXT.articleForm.createSuccess);
          this.router.navigate(['/catalog']);
        },
        error: (err) => {
          console.error('Error al subir el artículo:', err);
          this.toastService.error(err?.error?.message || MESSAGE_TEXT.articleForm.createError);
        }
      });
    } else {
      this.articleForm.markAllAsTouched();
    }
  }
}
