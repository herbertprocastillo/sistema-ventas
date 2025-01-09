import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingEditComponent } from './purchasing-edit.component';

describe('PurchasingEditComponent', () => {
  let component: PurchasingEditComponent;
  let fixture: ComponentFixture<PurchasingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasingEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
