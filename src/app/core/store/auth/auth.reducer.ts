import { createReducer, on, State } from '@ngrx/store';
import { User } from '../../models/user.model';
import {
  getCurrentUser,
  getCurrentUserSuccess,
  loginSuccess,
  logout,
  updateProfileSuccess,
} from './auth.actions';

export interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

export const authReducer = createReducer(
  initialState,

  on(loginSuccess, (state, { user }) => ({
    ...state,
    user,
  })),

  on(logout, (state) => ({
    ...state,
    user: null,
  })),

  on(updateProfileSuccess, (state, { user }) => ({
    ...state,
    user,
  })),

  on(getCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user,
  }))
);
