import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TwoFactorConfigurationDto } from '../../../../../core/dtos/2Fa/twoFactorConfiguration.dto';
import { QrCodeServiceService } from '../../../../../core/services/QrCodeService/qr-code-service.service';
import { Store } from '@ngrx/store';
import {
  startVerify,
  stopConfigure,
  stopVerify,
} from '../../../../../core/store/TwoFA/two-fa.actions';
import { TwoFaVerifyComponent } from '../../../../../shared/components/TwoFaVerify/two-fa-verify/two-fa-verify.component';
import { selectIsVerifying } from '../../../../../core/store/TwoFA/two-fa.selector';
import { TwoFaService } from '../../../../../core/services/2FaService/two-fa.service';
import { VerifyTwoFactorConfigurationDto } from '../../../../../core/dtos/2Fa/verifyTwoFactorConfiguration.dto';
import { ToastrService } from 'ngx-toastr';
import { getCurrentUser } from '../../../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-authenticator-setup',
  standalone: true,
  imports: [CommonModule, TwoFaVerifyComponent],
  templateUrl: './authenticator-setup.component.html',
})
export class AuthenticatorSetupComponent implements OnInit {
  private router = inject(Router);
  private qrCodeService = inject(QrCodeServiceService);
  private sanitizer = inject(DomSanitizer);
  private store = inject(Store);
  private twoFaConfigurationDto: TwoFactorConfigurationDto | null = null;
  private twoFaService = inject(TwoFaService);
  private toastr = inject(ToastrService);

  sharedKey: string = '';
  authenticatorUri: string = '';
  qrCodeUrl: SafeUrl = '';
  isCopied = false;
  isVerifying$ = this.store.select(selectIsVerifying);

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    this.twoFaConfigurationDto =
      navigation?.extras.state?.['twoFaConfigurationDto'];
  }

  ngOnInit(): void {
    if (this.twoFaConfigurationDto) {
      this.sharedKey = this.twoFaConfigurationDto.sharedKey;
      this.authenticatorUri = this.twoFaConfigurationDto.qrCodeUri;
      this.generateQrCode();
    } else {
      this.router.navigate(['/settings/2fa']);
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

  generateQrCode(): void {
    if (this.authenticatorUri) {
      this.qrCodeService
        .generateQrDataUrl(this.authenticatorUri)
        .then((url) => {
          this.qrCodeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        })
        .catch((err) => {
          this.toastr.error('Something went wrong! Please try again later');
        });
    } else {
      this.toastr.error('Something went wrong! Please try again later');
    }
  }

  onCancel() {
    this.router.navigate(['/settings/2fa']);
  }

  onComplete() {
    this.store.dispatch(stopConfigure());
    this.store.dispatch(startVerify());
  }

  copySharedKey() {
    navigator.clipboard.writeText(this.sharedKey).then(() => {
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 5000);
    });
  }
}
