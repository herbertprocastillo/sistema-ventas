import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingExportComponent } from './purchasing-export.component';

describe('PurchasingExportComponent', () => {
  let component: PurchasingExportComponent;
  let fixture: ComponentFixture<PurchasingExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasingExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasingExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
