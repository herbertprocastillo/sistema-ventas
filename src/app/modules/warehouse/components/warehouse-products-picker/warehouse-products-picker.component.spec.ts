import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseProductsPickerComponent } from './warehouse-products-picker.component';

describe('WarehouseProductsPickerComponent', () => {
  let component: WarehouseProductsPickerComponent;
  let fixture: ComponentFixture<WarehouseProductsPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseProductsPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseProductsPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
