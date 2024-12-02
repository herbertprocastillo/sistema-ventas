import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCartComponent } from './pos-cart.component';

describe('PosCartComponent', () => {
  let component: PosCartComponent;
  let fixture: ComponentFixture<PosCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
