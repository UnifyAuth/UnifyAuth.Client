import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEmailConfirmationComponent } from './change-email-confirmation.component';

describe('ChangeEmailConfirmationComponent', () => {
  let component: ChangeEmailConfirmationComponent;
  let fixture: ComponentFixture<ChangeEmailConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeEmailConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeEmailConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
