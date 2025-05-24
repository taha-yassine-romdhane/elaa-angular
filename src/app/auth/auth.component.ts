import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AuthComponent {
  signupForm: FormGroup;
  loginForm: FormGroup;
  showSignupForm = false;
  isLoginMode = true;
  loginWithEmail = true; // true pour email, false pour téléphone

  constructor(private fb: FormBuilder) {
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
      const loginData = this.loginForm.value;
      console.log('Tentative de connexion avec:', this.loginWithEmail ? 'email' : 'téléphone', loginData);
      // Implémentez ici la logique de connexion
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
      console.log('Compte créé avec:', this.signupForm.value);
      // Ici vous pouvez ajouter la logique pour enregistrer le compte
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