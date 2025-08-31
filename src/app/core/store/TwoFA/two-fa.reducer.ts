import { createReducer, on } from '@ngrx/store';
import {
  startConfigure,
  startVerify,
  stopConfigure,
  stopVerify,
  verifyFailure,
  verifySuccess,
} from './two-fa.actions';

export interface TwoFaState {
  isVerifying: boolean;
  isConfiguring: boolean;
  error: any;
}

const initialState: TwoFaState = {
  isVerifying: false,
  isConfiguring: false,
  error: null,
};

export const twoFaReducer = createReducer(
  initialState,
  on(startVerify, (state) => ({
    ...state,
    isVerifying: true,
    error: null,
  })),
  on(verifySuccess, (state) => ({
    ...state,
    isVerifying: false,
    error: null,
  })),
  on(verifyFailure, (state, { error }) => ({
    ...state,
    isVerifying: false,
    error,
  })),
  on(startConfigure, (state) => ({
    ...state,
    isConfiguring: true,
    error: null,
  })),
  on(stopVerify, (state) => ({
    ...state,
    isVerifying: false,
    error: null,
  })),
  on(stopConfigure, (state) => ({
    ...state,
    isConfiguring: false,
    error: null,
  }))
);
