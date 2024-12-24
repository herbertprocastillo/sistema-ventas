import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementsExportComponent } from './movements-export.component';

describe('MovementsExportComponent', () => {
  let component: MovementsExportComponent;
  let fixture: ComponentFixture<MovementsExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementsExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovementsExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
