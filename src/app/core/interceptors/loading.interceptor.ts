import { HttpInterceptorFn } from '@angular/common/http';
import { setIsLoading } from '../state/loading-state';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  setIsLoading(true);

  return next(req).pipe(finalize(() => setIsLoading(false)));
};
