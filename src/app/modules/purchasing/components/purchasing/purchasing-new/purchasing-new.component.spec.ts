import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingNewComponent } from './purchasing-new.component';

describe('PurchasingNewComponent', () => {
  let component: PurchasingNewComponent;
  let fixture: ComponentFixture<PurchasingNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasingNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasingNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
