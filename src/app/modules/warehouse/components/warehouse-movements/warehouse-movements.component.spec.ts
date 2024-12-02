import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseMovementsComponent } from './warehouse-movements.component';

describe('WarehouseMovementsComponent', () => {
  let component: WarehouseMovementsComponent;
  let fixture: ComponentFixture<WarehouseMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseMovementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
