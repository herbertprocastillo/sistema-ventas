import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersExportComponent } from './suppliers-export.component';

describe('SuppliersExportComponent', () => {
  let component: SuppliersExportComponent;
  let fixture: ComponentFixture<SuppliersExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppliersExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
