import { signal } from '@angular/core';

const _isLoading = signal(false);
export const isLoading = _isLoading.asReadonly();

export function setIsLoading(value: boolean) {
  _isLoading.set(value);
}
