import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissDiorComponent } from './miss-dior.component';

describe('MissDiorComponent', () => {
  let component: MissDiorComponent;
  let fixture: ComponentFixture<MissDiorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissDiorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissDiorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
