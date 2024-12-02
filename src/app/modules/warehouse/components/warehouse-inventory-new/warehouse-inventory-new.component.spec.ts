import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInventoryNewComponent } from './warehouse-inventory-new.component';

describe('WarehouseInventoryNewComponent', () => {
  let component: WarehouseInventoryNewComponent;
  let fixture: ComponentFixture<WarehouseInventoryNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseInventoryNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseInventoryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
