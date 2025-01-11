import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosRentComponent } from './pos-rent.component';

describe('PosRentComponent', () => {
  let component: PosRentComponent;
  let fixture: ComponentFixture<PosRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosRentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
