import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsExportComponent } from './products-export.component';

describe('ProductsExportComponent', () => {
  let component: ProductsExportComponent;
  let fixture: ComponentFixture<ProductsExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
