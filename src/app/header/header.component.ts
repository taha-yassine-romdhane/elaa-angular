import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  perfumeMenu = {
    promotions: [
      'Voir tout',
      'Idées cadeaux parfum ❤️',
      'Parfums à petits prix',
      'Nouveautés'
    ],
    brands: [
      'Top marques parfum',
      'Dior',
      'Chanel',
      'Yves Saint Laurent'
    ],
    women: {
      title: 'Parfum femme',
      items: [
        'Eau de parfum',
        'Eau de toilette',
        'Parfum cheveux',
        'Soin corps parfumé'
      ]
    },
    men: {
      title: 'Parfum homme',
      items: [
        'Eau de parfum',
        'Eau de toilette',
        'Eau de cologne',
        'Déodorant'
      ]
    },
    other: [
      'Parfum enfant',
      'Parfum d\'exception',
      'Gravure personnalisée 🎁',
      'Parfums rechargeables',
      'Bien-être'
    ],
    notes: {
      title: 'Notes olfactives',
      items: [
        'Parfum vanillé',
        'Parfum floral',
        'Parfum ambré',
        'Parfum boisé'
      ]
    },
    sets: {
      title: 'Coffret parfum',
      items: [
        'Coffret parfum femme',
        'Coffret parfum homme',
        'Coffret parfum enfant'
      ]
    }
  };

  makeupMenu = {
    eyes: {
      title: 'Maquillage - Yeux',
      items: [
        'Mascara',
        'Fard à paupières',
        'Eyeliner',
        'Crayon yeux & khôl',
        'Base paupière',
        'Feux-clis'
      ]
    },
    eyebrows: {
      title: 'Maquillage - Sourcils',
      items: [
        'Crayon & poudre sourcils',
        'Gel & Mascara Sourcils',
        'Kit Sourcils',
        'Bar à sourcils Benefit'
      ]
    },
    lips: {
      title: 'Maquillage - Lèvres',
      items: [
        'Rouge à lèvres',
        'Gloss',
        'Baume à lèvres',
        'Crayon à lèvres',
        'Base lèvres & Repulpeur'
      ]
    },
    face: {
      title: 'Maquillage - Teint',
      items: [
        'Fond de teint',
        'Anti-cerne et Correcteur',
        'Base de teint & Fixateur',
        'Poudre de soleil',
        'Poudre libre',
        'BB crème & CC crème',
        'Poudre matifiant',
        'Blush',
        'Highlighter',
        'Palette Teint',
        'Contouring'
      ]
    },
    accessories: {
      title: 'Autres',
      items: [
        'Ongles',
        'Pinceaux & éponges',
        'Démaquillant',
        'Accessoires maquillage'
      ]
    },
    inspiration: {
      title: 'Idées & inspirations beauté',
      items: [
        'Textures Tendances, Looks Intenses',
        'Préparer, fixer, sublimer',
        'Tendance sur les réseaux sociaux',
        'Souligner sa beauté',
        'Couleurs vibrantes',
        'Palettes atories',
        'Trouvez le fond de teint parfait'
      ]
    }
  };

  skincareMenu = {
    routines: {
      title: 'Routines',
      items: [
        'Coffret Soin Visage',
        'Routine soin visage',
        'Mini soin visage',
      ]
    },
    productTypes: {
      title: 'Type de soin',
      items: [
        'Sérum',
        'Crème de jour',
        'Crème de nuit',
        'Contour des yeux',
        'Soin des lèvres',
        'Gommage',
        'Soin des cils et sourcils',
        'Soin ciblé',
        'Huile visage',
        'BB crème & CC crème'
      ]
    },
    masks: {
      title: 'Masque visage',
      items: [
        'Masque tissu',
        'Masque crème'
      ]
    },
    needs: {
      title: 'Besoins',
      items: [
        'Soin anti-imperfections',
        'Soin anti-rides & anti-âge',
        'Soin hydratant & nourrissant',
        'Soin anti tache',
        'Soin pour les pores',
        'Soin anti-rougeurs',
        'Soin éclat & anti-fatigue',
        'Soin matifiant',
        'Soin peaux sensibles',
        'Soin raffermissant & liftant'
      ]
    },
    suncare: {
      title: 'Solaire',
      items: [
        'Après soleil visage',
        'Auto-bronzant visage',
        'Protection solaire visage'
      ]
    },
    cleansers: {
      title: 'Démaquillant & Nettoyant',
      items: [
        'Nettoyant Moussant Visage',
        'Lotion tonique',
        'Eau micellaire'
      ]
    },
    menSkincare: {
      title: 'Soin visage homme',
      items: [
        'Coffret Soin',
        'Soin Hydratant',
        'Nettoyant & Gommage',
        'Soin anti-cernes',
        'Soin anti âge'
      ]
    }
  };

  cartItemCount = 0;
  isSearchActive = false;
  isAuthenticated = false;
  user: any = null;
  private authSubscription: Subscription | null = null;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
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
            
            // Only mark for check, let Angular handle the change detection cycle
            this.cdr.markForCheck();
            console.log('[Header] Change detection marked');
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
    });
  }
  
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
  }

  // Placeholder for future cart functionality
  updateCartCount(count: number) {
    this.cartItemCount = count;
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
      
      console.log('[Header] Token decoded successfully. Auth state:', {
        isAuthenticated: this.isAuthenticated,
        user: this.user
      });
    } catch (error) {
      console.error('[Header] Error parsing token:', error);
      this.isAuthenticated = false;
      this.user = null;
      localStorage.removeItem('auth_token');
    }
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
}
