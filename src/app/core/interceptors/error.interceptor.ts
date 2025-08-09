import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'An unexpected error occurred';

      switch (error.status) {
        case 0:
          errorMessage =
            'Network error: Please check your internet connection. Or server may be down, please try again later.';
          break;
        case 400:
          if (error.error.message) {
            errorMessage =
              error.error?.message ||
              'Bad request: The server could not understand the request.';
          } else if (error.error.messages) {
            errorMessage = error.error.messages
              .map((e: string) => `• ${e}`)
              .join('<br/>');
          }
          break;
        case 401:
          errorMessage = 'Unauthorized: Please log in to access this resource.';
          break;
        case 403:
          errorMessage =
            'Forbidden: You do not have permission to access this resource.';
          break;
        case 404:
          if (error.error.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage =
              'Not found: The requested resource could not be found.';
          }
          break;
        case 500:
          errorMessage = 'Internal server error: Please try again later.';
          break;
        default:
          errorMessage =
            `Error ${error.status}: ${error.message}` ||
            `Error Status: ${error.status}. An unexpected error occurred`;
      }
      toastr.error(errorMessage, 'Error', { enableHtml: true });
      return throwError(() => error);
    })
  );
};
