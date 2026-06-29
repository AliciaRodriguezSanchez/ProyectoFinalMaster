import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoracionModalComponent } from './valoracion-modal';

describe('ValoracionModal', () => {
  let component: ValoracionModalComponent;
  let fixture: ComponentFixture<ValoracionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValoracionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValoracionModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
