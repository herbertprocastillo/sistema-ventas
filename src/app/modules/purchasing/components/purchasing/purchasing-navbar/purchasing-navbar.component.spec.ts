import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingNavbarComponent } from './purchasing-navbar.component';

describe('PurchasingNavbarComponent', () => {
  let component: PurchasingNavbarComponent;
  let fixture: ComponentFixture<PurchasingNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasingNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasingNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
