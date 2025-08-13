import { inject } from "@angular/core";
import { AuthService } from "../../../../../../../libs/shared-template/src/lib/shared-template/shared/services/auth.service";
import { Router } from "@angular/router";
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpEvent } from "@angular/common/http";
import { catchError, throwError, from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Token } from "../../../../../../../libs/shared-template/src/lib/shared-template/shared/interfaces/token";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = JSON.parse(localStorage.getItem('token')!);

  if (req.url.includes('refresh') || req.url.includes('login')) {
    return next(req);
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('refresh')) {
        return handle401Error(req, next, authService, router, token);
      }
      return throwError(error);
    })
  );
};

function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
  token: Token
): Observable<HttpEvent<any>> {
  return from(authService.refreshToken(token)).pipe(
    switchMap(newTokens => {
      localStorage.setItem('token', JSON.stringify(newTokens))
      const newRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${newTokens.access_token}`
        }
      });
      return next(newRequest);
    }),
    catchError(refreshError => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.reload();
      return throwError(() => refreshError);
    })
  );
}
