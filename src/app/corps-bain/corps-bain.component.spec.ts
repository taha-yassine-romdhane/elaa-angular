import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpsBainComponent } from './corps-bain.component';

describe('CorpsBainComponent', () => {
  let component: CorpsBainComponent;
  let fixture: ComponentFixture<CorpsBainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorpsBainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorpsBainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
