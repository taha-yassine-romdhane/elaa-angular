import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000'; // NestJS backend URL
  private readonly tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<any>(null);
  
  user$ = this.userSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkToken();
  }

  // This method is used to check if a token exists and is valid
  public checkToken() {
    console.log('AuthService: Checking for existing token');
    const token = localStorage.getItem(this.tokenKey);
    
    if (token) {
      try {
        console.log('AuthService: Found token, decoding...');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          id: payload.sub,
          email: payload.email,
          role: payload.role
        };
        console.log('AuthService: Token is valid, setting user:', user);
        this.userSubject.next(user);
      } catch (e) {
        console.error('AuthService: Invalid token found, logging out', e);
        this.logout();
      }
    } else {
      console.log('AuthService: No token found');
      this.userSubject.next(null);
    }
  }

  login(loginDto: LoginDto): Observable<AuthResponse> {
    console.log('AuthService: Login attempt with:', loginDto);
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, loginDto)
      .pipe(
        tap({
          next: (response) => {
            console.log('AuthService: Login successful, storing token');
            this.storeToken(response.access_token);
          },
          error: (error) => {
            console.error('AuthService: Login error:', error);
          }
        })
      );
  }

  signup(signupDto: SignupDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, signupDto);
  }

  logout(): Observable<void> {
    return new Observable(subscriber => {
      const token = localStorage.getItem(this.tokenKey);
      
      if (token) {
        // Call the backend logout endpoint
        this.http.post(`${this.apiUrl}/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .subscribe({
            next: () => {
              this.handleLogoutSuccess();
              subscriber.next();
              subscriber.complete();
            },
            error: (error) => {
              // Still clear local data even if the API call fails
              this.handleLogoutSuccess();
              subscriber.next();
              subscriber.complete();
            }
          });
      } else {
        this.handleLogoutSuccess();
        subscriber.next();
        subscriber.complete();
      }
    });
  }

  private handleLogoutSuccess(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
  }

  private storeToken(token: string): void {
    console.log('AuthService: Storing token in localStorage');
    localStorage.setItem(this.tokenKey, token);
    
    try {
      // Parse the token payload (second part of JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('AuthService: Decoded token payload:', payload);
      
      const user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role
      };
      
      console.log('AuthService: Emitting new user state:', user);
      this.userSubject.next(user);
      
      // Verify the state was updated
      console.log('AuthService: Current user state after update:', this.userSubject.value);
    } catch (error) {
      console.error('[AuthService] Error decoding token:', error);
      this.userSubject.next(null);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
