import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCategoryEditComponent } from './products-category-edit.component';

describe('ProductsCategoryEditComponent', () => {
  let component: ProductsCategoryEditComponent;
  let fixture: ComponentFixture<ProductsCategoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCategoryEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
