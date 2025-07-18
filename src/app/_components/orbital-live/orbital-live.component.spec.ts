import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrbitalLiveComponent } from './orbital-live.component';

describe('OrbitalLiveComponent', () => {
  let component: OrbitalLiveComponent;
  let fixture: ComponentFixture<OrbitalLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitalLiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrbitalLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
