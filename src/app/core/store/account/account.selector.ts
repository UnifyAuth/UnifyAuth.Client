import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountState } from './account.reducer';

export const selectEmailState = createFeatureSelector<AccountState>('account');

export const selectIsChangingEmail = createSelector(
  selectEmailState,
  (state) => state.isChangingEmail
);
