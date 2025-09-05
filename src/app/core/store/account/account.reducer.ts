import { createReducer, on } from '@ngrx/store';
import { emailChangeSuccess, startEmailChange } from './account.action';

export interface AccountState {
  isChangingEmail: boolean;
}

const initialState: AccountState = {
  isChangingEmail: false,
};

export const accountReducer = createReducer(
  initialState,

  on(startEmailChange, (state) => ({
    ...state,
    isChangingEmail: true,
  })),

  on(emailChangeSuccess, (state) => ({
    ...state,
    isChangingEmail: false,
  }))
);
