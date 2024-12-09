import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersNavbarComponent } from './customers-navbar.component';

describe('CustomersNavbarComponent', () => {
  let component: CustomersNavbarComponent;
  let fixture: ComponentFixture<CustomersNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
