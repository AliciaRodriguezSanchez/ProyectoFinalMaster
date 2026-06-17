import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoracionModal } from './valoracion-modal';

describe('ValoracionModal', () => {
  let component: ValoracionModal;
  let fixture: ComponentFixture<ValoracionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValoracionModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValoracionModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
