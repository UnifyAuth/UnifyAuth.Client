import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { emailConfirmedGuard } from '../../core/guards/email-confirmed.guard';
import { authenticatorSetupGuard } from '../../core/guards/authenticator-setup.guard';

export const mainLayoutRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../../layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        canActivate: [emailConfirmedGuard],
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./profile/profile.component').then(
                (m) => m.ProfileComponent
              ),
          },
          {
            path: 'edit',
            loadComponent: () =>
              import('./profile/edit-profile/edit-profile.component').then(
                (m) => m.EditProfileComponent
              ),
          },
        ],
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./settings/settings.component').then(
                (m) => m.SettingsComponent
              ),
          },
          {
            path: '2fa',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './settings/two-fa-configure/two-fa-configure.component'
                  ).then((m) => m.TwoFaConfigureComponent),
              },
              {
                path: 'authenticator',
                canActivate: [authenticatorSetupGuard],
                loadComponent: () =>
                  import(
                    './settings/two-fa-configure/authenticator-setup/authenticator-setup.component'
                  ).then((m) => m.AuthenticatorSetupComponent),
              },
            ],
          },
        ],
      },
    ],
  },
];
