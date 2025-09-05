import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { selectUser } from '../../../../core/store/auth/auth.selector';
import { AccountService } from '../../../../core/services/account/account.service';
import { isLoading } from '../../../../core/state/loading-state';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './change-email.component.html',
})
export class ChangeEmailComponent {
  private store = inject(Store);
  private toastr = inject(ToastrService);
  private accountService = inject(AccountService);
  private router = inject(Router);

  user$ = this.store.select(selectUser);
  changeEmailForm: FormGroup;
  loading = isLoading;

  constructor(private fb: FormBuilder) {
    this.changeEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  save(): void {
    if (this.changeEmailForm.valid) {
      this.user$.subscribe((user) => {
        if (user?.email == this.changeEmailForm.value.email) {
          this.toastr.error(
            'The new email address must be different from the current one.',
            'Error'
          );
          return;
        }
      });
      this.accountService
        .sendChangeEmailLink(this.changeEmailForm.value.email)
        .subscribe(() => {
          const newEmail = this.changeEmailForm.value.email;
          localStorage.setItem('newEmail', newEmail); // Save to localStorage for using in confirmation component
          this.toastr.success(
            'A confirmation link has been sent to your new email address. Please check your inbox to confirm the change.',
            'Success'
          );
          this.changeEmailForm.reset();
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/settings']);
  }
}
