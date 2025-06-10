import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent]
})
export class AuthComponent {
  signupForm: FormGroup;
  loginForm: FormGroup;
  showSignupForm = false;
  isLoginMode = true;
  loginWithEmail = true; // true pour email, false pour téléphone

  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialisation du formulaire d'inscription
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]]
    }, { validators: this.passwordMatchValidator });

    // Initialisation du formulaire de connexion
    this.loginForm = this.fb.group({
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^[0-9]{8}$/)]],
      password: ['', [Validators.required]]
    });

    // Configuration initiale des validateurs
    this.updateLoginValidators();
  }

  // Méthode pour mettre à jour les validateurs en fonction de la méthode de connexion
  updateLoginValidators() {
    const emailControl = this.loginForm.get('email');
    const phoneControl = this.loginForm.get('phoneNumber');

    if (this.loginWithEmail) {
      emailControl?.setValidators([Validators.required, Validators.email]);
      phoneControl?.clearValidators();
    } else {
      emailControl?.clearValidators();
      phoneControl?.setValidators([Validators.required, Validators.pattern(/^[0-9]{8}$/)]);
    }

    emailControl?.updateValueAndValidity();
    phoneControl?.updateValueAndValidity();
  }

  // Vérifie que les mots de passe correspondent
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  // Bascule entre le formulaire d'inscription et de connexion
  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.loginForm.reset();
  }

  // Gère la soumission du formulaire de connexion
  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      // Format the login data according to the API requirements
      const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      
      console.log('[Auth] Login attempt with:', loginData);
      
      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('[Auth] Login successful:', response);
          this.loading = false;
          
          // Don't force page reload - use Angular router instead
          console.log('[Auth] Navigating to home page...');
          this.router.navigate(['/'])
            .then(success => {
              console.log('[Auth] Navigation result:', success ? 'success' : 'failed');
            })
            .catch(err => {
              console.error('[Auth] Navigation error:', err);
            });
        },
        error: (error) => {
          this.loading = false;
          console.error('[Auth] Login error:', error);
          
          if (error.status === 0) {
            this.errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier que le serveur backend est en cours d\'exécution.';
          } else {
            this.errorMessage = error.error?.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.';
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  // Bascule entre l'email et le téléphone pour la connexion
  toggleLoginMethod() {
    this.loginWithEmail = !this.loginWithEmail;
    this.loginForm.patchValue({
      email: '',
      phoneNumber: ''
    });
    this.updateLoginValidators();
  }

  // Gère la soumission du formulaire d'inscription
  onSubmit() {
    if (this.signupForm.valid && !this.signupForm.hasError('mismatch')) {
      this.loading = true;
      this.errorMessage = '';
      
      const signupData = {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        phoneNumber: this.signupForm.value.phoneNumber
      };
      
      this.authService.signup(signupData).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Inscription réussie', response);
          // Après l'inscription réussie, on peut soit connecter l'utilisateur directement
          // soit le rediriger vers la page de connexion
          this.isLoginMode = true;
          this.loginForm.patchValue({
            email: signupData.email,
            password: ''
          });
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Échec de l\'inscription. Veuillez réessayer.';
          console.error('Erreur d\'inscription', error);
        }
      });
    } else {
      console.log('Formulaire invalide');
      if (this.signupForm.hasError('mismatch')) {
        console.log('Les mots de passe ne correspondent pas');
      }
      this.signupForm.markAllAsTouched();
    }
  }

  // Bascule entre les étapes du formulaire d'inscription
  toggleSignupForm() {
    this.showSignupForm = !this.showSignupForm;
  }
}