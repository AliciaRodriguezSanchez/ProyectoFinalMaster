import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-avatar-uploader',
  standalone: true,
  imports: [],
  templateUrl: './avatar-uploader.html',
  styleUrl: './avatar-uploader.css',
})
export class AvatarUploader {
  @Input() currentImageUrl: string | null = null;

  @Output() onFileSelected = new EventEmitter<File>();

  previewUrl: string | null = null;

  defaultAvatar: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  get avatarImage(): string {
    return this.previewUrl || this.currentImageUrl || this.defaultAvatar;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.onFileSelected.emit(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
