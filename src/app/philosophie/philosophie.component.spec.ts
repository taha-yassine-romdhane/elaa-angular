import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhilosophieComponent } from './philosophie.component';

describe('PhilosophieComponent', () => {
  let component: PhilosophieComponent;
  let fixture: ComponentFixture<PhilosophieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhilosophieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhilosophieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
