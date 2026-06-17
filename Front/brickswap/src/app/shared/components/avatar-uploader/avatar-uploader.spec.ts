import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarUploader } from './avatar-uploader';

describe('AvatarUploader', () => {
  let component: AvatarUploader;
  let fixture: ComponentFixture<AvatarUploader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarUploader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarUploader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
