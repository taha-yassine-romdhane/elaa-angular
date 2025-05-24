import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoinDeVisageComponent } from './soin-de-visage.component';

describe('SoinDeVisageComponent', () => {
  let component: SoinDeVisageComponent;
  let fixture: ComponentFixture<SoinDeVisageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoinDeVisageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoinDeVisageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
