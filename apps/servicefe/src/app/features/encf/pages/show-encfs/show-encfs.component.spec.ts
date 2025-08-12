import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEncfsComponent } from './show-encfs.component';

describe('ShowEncfsComponent', () => {
  let component: ShowEncfsComponent;
  let fixture: ComponentFixture<ShowEncfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowEncfsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowEncfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
