import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account/account.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  isUserPanelOpen = signal(false);
  private router = inject(Router);
  private accountService = inject(AccountService);

  toggleUserPanel() {
    this.isUserPanelOpen.set(!this.isUserPanelOpen());
  }

  closeUserPanel() {
    this.isUserPanelOpen.set(false);
  }

  onProfileClick() {
    console.log('Profile clicked');
    this.accountService.getUserProfile().subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
    });
  }

  onSettingsClick() {
    this.router.navigate(['/register']);
    // Settings sayfasına yönlendirme yapılacak
  }

  onLogoutClick() {
    console.log('Logout clicked');
    // Logout işlemi yapılacak
  }
}
