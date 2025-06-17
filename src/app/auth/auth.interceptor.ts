import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding token for login, signup, and public product requests
    if (
      request.url.includes('/auth/login') || 
      (request.url.includes('/users') && request.method === 'POST') ||
      request.url.includes('/products/by-category') ||
      request.url.includes('/products/by-brand') ||
      request.url.includes('/products/by-color')
    ) {
      return next.handle(request);
    }

    // Get the token from the auth service
    const token = this.authService.getToken();
    
    if (token) {
      // Clone the request and add the token to the headers
      request = this.addToken(request, token);
    }

    // Handle the request and catch any errors
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Token is expired or invalid, redirect to login
          this.authService.logout();
          this.router.navigate(['/auth']);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
