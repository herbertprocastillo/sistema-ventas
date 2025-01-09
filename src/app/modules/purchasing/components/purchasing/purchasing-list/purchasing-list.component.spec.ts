import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingListComponent } from './purchasing-list.component';

describe('PurchasingListComponent', () => {
  let component: PurchasingListComponent;
  let fixture: ComponentFixture<PurchasingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
