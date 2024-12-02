import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosProductsComponent } from './pos-products.component';

describe('PosProductsComponent', () => {
  let component: PosProductsComponent;
  let fixture: ComponentFixture<PosProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
