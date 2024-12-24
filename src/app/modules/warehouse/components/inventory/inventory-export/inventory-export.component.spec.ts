import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryExportComponent } from './inventory-export.component';

describe('InventoryExportComponent', () => {
  let component: InventoryExportComponent;
  let fixture: ComponentFixture<InventoryExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
