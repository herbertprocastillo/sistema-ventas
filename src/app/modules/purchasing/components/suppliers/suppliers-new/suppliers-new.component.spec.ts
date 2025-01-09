import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersNewComponent } from './suppliers-new.component';

describe('SuppliersNewComponent', () => {
  let component: SuppliersNewComponent;
  let fixture: ComponentFixture<SuppliersNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppliersNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppliersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
