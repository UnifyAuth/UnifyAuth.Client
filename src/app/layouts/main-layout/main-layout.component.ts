import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TokenService } from '../../core/services/auth/token.service';
import { AccountService } from '../../core/services/account/account.service';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../core/store/auth/auth.actions';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  private tokenService = inject(TokenService);
  private accountService = inject(AccountService);
  private store = inject(Store);

  ngOnInit() {
    this.accountService.getUserProfile().subscribe({
      next: (user) => {
        const fullName = `${user.firstName} ${user.lastName}`;
        this.store.dispatch(loginSuccess({ user: { ...user, fullName } }));
      },
    });
  }
}
