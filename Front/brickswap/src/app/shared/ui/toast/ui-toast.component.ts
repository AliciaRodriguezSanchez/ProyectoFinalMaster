import { Component, inject } from '@angular/core';
import { UiToastService } from '../../../core/services/toast/ui-toast.service';

@Component({
  selector: 'ui-toast',
  templateUrl: './ui-toast.component.html',
  styleUrl: './ui-toast.component.scss',
})
export class UiToastComponent {
  toastService = inject(UiToastService);
}
