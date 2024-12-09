import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsNewComponent } from './fields-new.component';

describe('FieldsNewComponent', () => {
  let component: FieldsNewComponent;
  let fixture: ComponentFixture<FieldsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
