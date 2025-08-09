import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account/account.service';
import { Store } from '@ngrx/store';
import { selectFullName } from '../../../core/store/auth/auth.selector';
import { TokenService } from '../../../core/services/auth/token.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private router = inject(Router);
  private accountService = inject(AccountService);
  private store = inject(Store);

  isUserPanelOpen = signal(false);
  fullName$ = this.store.select(selectFullName);

  toggleUserPanel() {
    this.isUserPanelOpen.set(!this.isUserPanelOpen());
  }

  closeUserPanel() {
    this.isUserPanelOpen.set(false);
  }

  onProfileClick() {
    this.accountService.getUserProfile().subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
    });
  }

  onSettingsClick() {
    this.router.navigate(['/register']);
  }

  onLogoutClick() {
    console.log('Logout clicked');
  }
}
