import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersNewComponent } from './users-new.component';

describe('UsersNewComponent', () => {
  let component: UsersNewComponent;
  let fixture: ComponentFixture<UsersNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
