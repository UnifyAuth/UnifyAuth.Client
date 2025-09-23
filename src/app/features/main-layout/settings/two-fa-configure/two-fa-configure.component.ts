import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TwoFaService } from '../../../../core/services/2FaService/two-fa.service';
import { TwoFactorConfigurationDto } from '../../../../core/dtos/2Fa/twoFactorConfiguration.dto';
import { AuthenticationProviderType } from '../../../../core/enums/authentication-provider-type.enum';
import { isLoading } from '../../../../core/state/loading-state';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { Store } from '@ngrx/store';
import {
  startConfigure,
  startVerify,
  stopVerify,
} from '../../../../core/store/TwoFA/two-fa.actions';
import { selectIsVerifying } from '../../../../core/store/TwoFA/two-fa.selector';
import { TwoFaVerifyComponent } from '../../../../shared/components/TwoFaVerify/two-fa-verify/two-fa-verify.component';
import { VerifyTwoFactorConfigurationDto } from '../../../../core/dtos/2Fa/verifyTwoFactorConfiguration.dto';
import { ToastrService } from 'ngx-toastr';
import { getCurrentUser } from '../../../../core/store/auth/auth.actions';
import { Observable } from 'rxjs';
import { User } from '../../../../core/models/user.model';
import { selectUser } from '../../../../core/store/auth/auth.selector';

@Component({
  selector: 'app-two-fa-configure',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TwoFaVerifyComponent],
  templateUrl: './two-fa-configure.component.html',
})
export class TwoFaConfigureComponent {
  private twoFaService = inject(TwoFaService);
  private router = inject(Router);
  private store = inject(Store);
  private toastr = inject(ToastrService);

  selectedMethod: 'authenticator' | 'email' | 'phone' | 'none' | null = null;
  Loading = isLoading;
  twoFaConfigurationDto: TwoFactorConfigurationDto | null = null;
  isVerifying$ = this.store.select(selectIsVerifying);
  user$!: Observable<User | null>;
  verificationMessage = '';

  constructor() {
    this.user$ = this.store.select(selectUser);
  }

  getProviderLabel(
    provider: AuthenticationProviderType | undefined | null
  ): string {
    switch (provider) {
      case AuthenticationProviderType.None:
        return 'None';
      default:
        return '—';
    }
  }

  selectMethod(method: 'authenticator' | 'email' | 'phone' | 'none'): void {
    this.selectedMethod = method;
  }

  saveSelection(): void {
    if (this.selectedMethod) {
      switch (this.selectedMethod) {
        case 'authenticator':
          this.verificationMessage =
            'Enter the code from your authenticator app.';
          break;
        case 'email':
          this.verificationMessage = 'Enter the code sent to your email.';
          break;
        case 'phone':
          this.verificationMessage = 'Enter the code sent to your phone.';
          break;
      }
      this.twoFaService.configure2Fa(this.selectedMethod).subscribe({
        next: (twoFaConfigurationDto: TwoFactorConfigurationDto) => {
          // prettier-ignore
          if (twoFaConfigurationDto.provider == AuthenticationProviderType.Authenticator) {
            this.store.dispatch(startConfigure());
            this.router.navigate(['/settings/2fa/authenticator'], {
              state: { twoFaConfigurationDto },
            });
          }else if(twoFaConfigurationDto.provider == AuthenticationProviderType.Email || 
            twoFaConfigurationDto.provider == AuthenticationProviderType.Sms){
            this.twoFaConfigurationDto = twoFaConfigurationDto;
            this.store.dispatch(startVerify())
          }else{
            this.store.dispatch(getCurrentUser());
            this.router.navigate(['/settings']);
            this.toastr.success('2-Step Verification disabled successfully.');
          }
        },
      });
    } else {
      this.toastr.error('Please select a method to continue.');
    }
  }
  onCodeVerified(code: string) {
    const verifyTwoFaDto: VerifyTwoFactorConfigurationDto = {
      provider: this.twoFaConfigurationDto!.provider,
      key: code,
    };
    this.twoFaService.verify2FaConfiguration(verifyTwoFaDto).subscribe({
      next: () => {
        this.store.dispatch(getCurrentUser());
        this.store.dispatch(stopVerify());
        this.toastr.success('2-Step Verification completed successfully.');
        this.router.navigate(['/settings']);
      },
    });
  }

  onCancel() {
    this.router.navigate(['/settings']);
  }
}
