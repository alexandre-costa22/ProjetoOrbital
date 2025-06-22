import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareItComponent } from './share-it.component';

describe('ShareItComponent', () => {
  let component: ShareItComponent;
  let fixture: ComponentFixture<ShareItComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareItComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareItComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
