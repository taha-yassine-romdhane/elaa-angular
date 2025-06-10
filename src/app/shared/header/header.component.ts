import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  user: any = null;
  cartItemCount = 0;
  private authSubscription: Subscription | null = null;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private appRef: ApplicationRef
  ) {
    console.log('[Header] Constructor called, initial state:', {
      isAuthenticated: this.isAuthenticated,
      user: this.user
    });
  }

  ngOnInit(): void {
    console.log('[Header] ngOnInit called');
    
    // Use NgZone to ensure Angular detects changes
    this.zone.run(() => {
      // Initial check for authentication state
      this.checkAuthState();
      
      // Subscribe to auth state changes
      this.authSubscription = this.authService.user$.subscribe({
        next: (user) => {
          console.log('[Header] Auth state changed:', user ? 'User authenticated' : 'User not authenticated', user);
          
          // Update component state inside zone
          this.zone.run(() => {
            this.isAuthenticated = !!user;
            this.user = user;
            
            console.log('[Header] Updated state:', { 
              isAuthenticated: this.isAuthenticated, 
              user: this.user 
            });
            
            // Force component update through multiple mechanisms
            try {
              this.cdr.detectChanges();
              this.cdr.markForCheck();
              // Force application tick
              this.appRef.tick();
              console.log('[Header] Multiple change detection strategies applied');
              
              // Debug DOM state
              setTimeout(() => {
                console.log('[Header] DOM state after timeout:', { 
                  isAuthenticated: this.isAuthenticated,
                  user: this.user,
                  authHeaderVisible: document.querySelector('.auth-header') ? true : false,
                  guestHeaderVisible: document.querySelector('.guest-header') ? true : false
                });
              }, 100);
            } catch (error) {
              console.error('[Header] Error during change detection:', error);
            }
          });
        },
        error: (error) => {
          console.error('[Header] Error in auth subscription:', error);
          this.zone.run(() => {
            this.isAuthenticated = false;
            this.user = null;
            this.cdr.detectChanges();
          });
        }
      });
      
      // Log initial state
      console.log('[Header] Initial auth check complete', {
        isAuthenticated: this.isAuthenticated,
        user: this.user
      });
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /**
   * Check authentication state using the AuthService
   */
  private checkAuthState(): void {
    console.log('[Header] Checking auth state...');
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      console.log('[Header] No auth token found');
      this.isAuthenticated = false;
      this.user = null;
      return;
    }
    
    try {
      console.log('[Header] Found auth token, decoding...');
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('[Header] Token payload:', payload);
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.warn('[Header] Token expired', { exp: payload.exp, now: currentTime });
        this.isAuthenticated = false;
        this.user = null;
        localStorage.removeItem('auth_token');
        return;
      }
      
      this.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role
      };
      this.isAuthenticated = true;
      
      // Also directly update the authService user subject to ensure consistency
      this.authService.checkToken();
      
      console.log('[Header] Token decoded successfully. Auth state:', {
        isAuthenticated: this.isAuthenticated,
        user: this.user
      });
      
      // Force UI update
      this.cdr.detectChanges();
    } catch (error) {
      console.error('[Header] Error parsing token:', error);
      this.isAuthenticated = false;
      this.user = null;
      localStorage.removeItem('auth_token');
    }
  }

  onSearch(): void {
    console.log('Search clicked');
    // Implement search functionality
  }

  onCartClick(): void {
    this.router.navigate(['/pannier']);
  }

  onLoginClick(): void {
    this.router.navigate(['/auth']);
  }

  onLogout(): void {
    console.log('[Header] Logout initiated');
    this.zone.run(() => {
      this.authService.logout().subscribe({
        next: () => {
          console.log('[Header] Logout successful');
          this.zone.run(() => {
            this.isAuthenticated = false;
            this.user = null;
            this.cdr.detectChanges();
            this.router.navigate(['/']).then(success => {
              if (success) {
                console.log('[Header] Navigation to home successful');
              } else {
                console.warn('[Header] Navigation to home failed');
              }
            });
          });
        },
        error: (error: any) => {
          console.error('[Header] Logout error:', error);
          // Still update UI even if logout API fails
          this.zone.run(() => {
            this.isAuthenticated = false;
            this.user = null;
            this.cdr.detectChanges();
            this.router.navigate(['/']);
          });
        }
      });
    });
  }

  onProfileClick(): void {
    this.router.navigate(['/profile']);
  }
}
