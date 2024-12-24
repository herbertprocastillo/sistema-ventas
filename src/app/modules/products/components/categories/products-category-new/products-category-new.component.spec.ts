import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCategoryNewComponent } from './products-category-new.component';

describe('ProductsCategoryNewComponent', () => {
  let component: ProductsCategoryNewComponent;
  let fixture: ComponentFixture<ProductsCategoryNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCategoryNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsCategoryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
