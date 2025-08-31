import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../../core/store/auth/auth.selector';
import { filter, switchMap, take } from 'rxjs';
import { AuthenticationProviderType } from '../../../../core/enums/authentication-provider-type.enum';
import { AccountService } from '../../../../core/services/account/account.service';
import { User } from '../../../../core/models/user.model';
import { updateProfileSuccess } from '../../../../core/store/auth/auth.actions';
import { isLoading } from '../../../../core/state/loading-state';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private currentUser?: User;

  loading = isLoading;

  user$ = this.store
    .select(selectUser)
    .pipe(filter((u): u is NonNullable<typeof u> => !!u));

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    phoneNumber: ['', [Validators.maxLength(20), Validators.required]],
  });

  ngOnInit(): void {
    this.user$.pipe(take(1)).subscribe((user) => {
      this.currentUser = user;
      this.form.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    // If no changes were made, navigate back to profile
    if (
      this.currentUser &&
      raw.firstName === this.currentUser.firstName &&
      raw.lastName === this.currentUser.lastName &&
      raw.phoneNumber === this.currentUser.phoneNumber
    ) {
      this.router.navigate(['/profile']);
      return;
    }

    const payload: User = {
      id: this.currentUser?.id,
      ...this.form.getRawValue(),
    };
    this.accountService
      .updateUserProfile(payload)
      .pipe(
        switchMap(() => this.accountService.getUserProfile()),
        take(1)
      )
      .subscribe({
        next: (freshUser) => {
          this.store.dispatch(updateProfileSuccess({ user: { ...freshUser } }));
          this.router.navigate(['/profile']);
        },
      });
  }

  onCancel() {
    this.router.navigate(['/profile']);
  }
}
