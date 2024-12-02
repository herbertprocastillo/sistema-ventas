import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCategoryListComponent } from './products-category-list.component';

describe('ProductsCategoryListComponent', () => {
  let component: ProductsCategoryListComponent;
  let fixture: ComponentFixture<ProductsCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCategoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
