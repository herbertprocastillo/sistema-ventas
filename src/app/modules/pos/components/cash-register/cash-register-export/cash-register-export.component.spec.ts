import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterExportComponent } from './cash-register-export.component';

describe('CashRegisterExportComponent', () => {
  let component: CashRegisterExportComponent;
  let fixture: ComponentFixture<CashRegisterExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashRegisterExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashRegisterExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
