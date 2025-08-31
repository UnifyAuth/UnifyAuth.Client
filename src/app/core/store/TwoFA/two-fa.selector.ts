import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TwoFaState } from './two-fa.reducer';

export const selectTwoFaState = createFeatureSelector<TwoFaState>('twoFa');

export const selectIsVerifying = createSelector(
  selectTwoFaState,
  (state: TwoFaState) => state.isVerifying
);

export const selectIsConfiguring = createSelector(
  selectTwoFaState,
  (state: TwoFaState) => state.isConfiguring
);
