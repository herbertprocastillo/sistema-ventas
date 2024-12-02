import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInventoryListComponent } from './warehouse-inventory-list.component';

describe('WarehouseInventoryListComponent', () => {
  let component: WarehouseInventoryListComponent;
  let fixture: ComponentFixture<WarehouseInventoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseInventoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseInventoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
