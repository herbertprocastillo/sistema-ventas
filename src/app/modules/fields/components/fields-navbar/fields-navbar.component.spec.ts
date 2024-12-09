import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsNavbarComponent } from './fields-navbar.component';

describe('FieldsNavbarComponent', () => {
  let component: FieldsNavbarComponent;
  let fixture: ComponentFixture<FieldsNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
