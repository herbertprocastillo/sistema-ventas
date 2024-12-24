import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCategoryByIdComponent } from './products-category-by-id.component';

describe('ProductsCategoryByIdComponent', () => {
  let component: ProductsCategoryByIdComponent;
  let fixture: ComponentFixture<ProductsCategoryByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCategoryByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsCategoryByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
