import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementsNewComponent } from './movements-new.component';

describe('MovementsNewComponent', () => {
  let component: MovementsNewComponent;
  let fixture: ComponentFixture<MovementsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementsNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovementsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
