import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const logout = createAction('[Auth] Logout');

export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ user: User }>()
);

export const getCurrentUser = createAction('[Auth] Get Current User');

export const getCurrentUserSuccess = createAction(
  '[Auth] Get Current User Success',
  props<{ user: User }>()
);

export const getCurrentUserFailure = createAction(
  '[Auth] Get Current User Failure',
  props<{ error: any }>()
);
