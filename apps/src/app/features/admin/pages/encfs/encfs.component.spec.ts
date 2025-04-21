import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncfsComponent } from './encfs.component';

describe('EncfsComponent', () => {
  let component: EncfsComponent;
  let fixture: ComponentFixture<EncfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncfsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
