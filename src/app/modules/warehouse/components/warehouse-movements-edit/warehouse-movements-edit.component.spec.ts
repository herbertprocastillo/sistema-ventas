import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseMovementsEditComponent } from './warehouse-movements-edit.component';

describe('WarehouseMovementsEditComponent', () => {
  let component: WarehouseMovementsEditComponent;
  let fixture: ComponentFixture<WarehouseMovementsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseMovementsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseMovementsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
