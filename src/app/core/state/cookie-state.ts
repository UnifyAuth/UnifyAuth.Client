import { signal } from '@angular/core';

const _isCookieOff = signal(false);
export const isCookieOff = _isCookieOff.asReadonly();

export function setCookieOff(value: boolean) {
  _isCookieOff.set(value);
}
