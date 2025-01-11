import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterNewComponent } from './cash-register-new.component';

describe('CashRegisterNewComponent', () => {
  let component: CashRegisterNewComponent;
  let fixture: ComponentFixture<CashRegisterNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashRegisterNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashRegisterNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
