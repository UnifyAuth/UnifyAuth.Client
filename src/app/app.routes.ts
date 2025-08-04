import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.route';
import { mainLayoutRoutes } from './features/main-layout/main-layout.route';

export const routes: Routes = [...authRoutes, ...mainLayoutRoutes];
