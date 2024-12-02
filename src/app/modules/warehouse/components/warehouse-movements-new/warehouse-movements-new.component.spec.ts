import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseMovementsNewComponent } from './warehouse-movements-new.component';

describe('WarehouseMovementsNewComponent', () => {
  let component: WarehouseMovementsNewComponent;
  let fixture: ComponentFixture<WarehouseMovementsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseMovementsNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseMovementsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
