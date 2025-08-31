import { createAction, props } from '@ngrx/store';

export const startVerify = createAction('[2FA] Start Verify');
export const stopVerify = createAction('[2FA] Stop Verify');
export const verifySuccess = createAction('[2FA] Verify Success');
export const verifyFailure = createAction(
  '[2FA] Verify Failure',
  props<{ error: any }>()
);
export const startConfigure = createAction('[2FA] Start Configure');
export const stopConfigure = createAction('[2FA] Stop Configure');
