import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseNavbarComponent } from './warehouse-navbar.component';

describe('WarehouseNavbarComponent', () => {
  let component: WarehouseNavbarComponent;
  let fixture: ComponentFixture<WarehouseNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
