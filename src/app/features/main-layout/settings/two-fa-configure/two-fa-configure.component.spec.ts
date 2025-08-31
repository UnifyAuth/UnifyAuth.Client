import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFaConfigureComponent } from './two-fa-configure.component';

describe('TwoFaConfigureComponent', () => {
  let component: TwoFaConfigureComponent;
  let fixture: ComponentFixture<TwoFaConfigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoFaConfigureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoFaConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
