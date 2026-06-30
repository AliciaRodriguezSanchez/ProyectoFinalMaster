import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormTemplate } from '../../shared/components/form-template/form-template';
import { ArticleService } from '../../core/services/article/article.service';
import { MESSAGE_TEXT } from '../../core/constants/message-text';
import { UiToastService } from '../../core/services/toast/ui-toast.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormTemplate],
  templateUrl: './article-form.html',
  styleUrl: './article-form.css',
})
export class ArticleForm {
  articleForm!: FormGroup;

  imagePreview: string | null = null;

  // 1. INYECCION DE ROUTER Y SERVICIO
  constructor (
    private fb: FormBuilder,
    private articleService: ArticleService,
    private router: Router,
    private toastService: UiToastService
  ) {
    this.initForm();
  }


  // 2. INICIALIZACIÓN FORMULARIO
  private initForm() {
    this.articleForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(15)]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      estado_articulo: ['', [Validators.required]],
      categoria_id: ['', [Validators.required]],
      foto: [''],
      estado_revision: ['Borrador'],
      perfil_id: [1]
    });
  }

  // 3. CAPTURAR FOTO PARA FORMULARIO
  onUrlChange(event: any) {
  const url = event.target.value;
  this.imagePreview = url;
  this.articleForm.patchValue({ foto: url });
  }

  // 4. MÉTODO PARA PROCESAR FORMULARIO
  submitForm(targetState: 'Borrador' | 'Publicado') {
    this.articleForm.patchValue({ estado_revision: targetState});

    if (this.articleForm.valid) {
      // 5. LLAMADA A LA API
      const formValue = {
        ...this.articleForm.value,
        categoria_id: Number(this.articleForm.value.categoria_id)
      }
      this.articleService.createArticle(this.articleForm.value).subscribe({
        next: (response) => {
          console.log(' Artículo subido a Brickswap:', response);
          this.toastService.success(MESSAGE_TEXT.articleForm.createSuccess);
          this.router.navigate(['/catalog']);
        },
        error: (err) => {
          console.error('Error al subir el artículo:', err);
          this.toastService.error(MESSAGE_TEXT.articleForm.createError);
        }
      });
    } else {
      this.articleForm.markAllAsTouched();
    }
  }
}
