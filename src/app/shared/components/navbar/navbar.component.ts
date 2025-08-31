import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account/account.service';
import { Store } from '@ngrx/store';
import { selectFullName } from '../../../core/store/auth/auth.selector';
import { AuthService } from '../../../core/services/auth/auth.service';
import { logout } from '../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private router = inject(Router);
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
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
        this.router.navigate(['/profile']).then(() => this.closeUserPanel());
      },
    });
  }

  onLogoutClick() {
    this.authService.logout().subscribe({
      next: () => {
        this.store.dispatch(logout());
        this.router.navigate(['/login']);
      },
    });
  }

  onLogoClick() {
    this.router.navigate(['/dashboard']).then(() => this.closeUserPanel());
  }

  onSettingsClick() {
    this.router.navigate(['/settings']).then(() => this.closeUserPanel());
  }
}
