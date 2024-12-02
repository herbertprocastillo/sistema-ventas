import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseMovementsListComponent } from './warehouse-movements-list.component';

describe('WarehouseMovementsListComponent', () => {
  let component: WarehouseMovementsListComponent;
  let fixture: ComponentFixture<WarehouseMovementsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseMovementsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseMovementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
