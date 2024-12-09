import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementsEditComponent } from './movements-edit.component';

describe('MovementsEditComponent', () => {
  let component: MovementsEditComponent;
  let fixture: ComponentFixture<MovementsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovementsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
