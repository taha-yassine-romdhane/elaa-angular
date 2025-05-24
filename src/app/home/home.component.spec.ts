import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";

// Interfaces for beauty products and categories
interface BeautyProduct {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  icon: string;
}

interface BeautyCategory {
  name: string;
  icon: string;
}

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
showLoginPassword: boolean = false;
showSignupPassword: boolean = false;
heroCategories: any;
collectionCategories: any;
getProductImage(_t101: BeautyProduct) {
throw new Error('Method not implemented.');
}
  // Variables for form data (sign up and login)
  signUpEmail: string = '';
  confirmPassword: string = '';
  signUpPassword: string = '';
  signupName: string = '';
  loginEmail: string = '';
  loginPassword: string = '';

  activeTab: 'login' | 'signup' = 'login'; // Tracks the active tab ('login' or 'signup')

  // Arrays for beauty products and categories
  featuredProducts: BeautyProduct[] = [
    { id: 1, name: 'Sérum Éclat Jeunesse', category: 'Soins du Visage', description: 'Hydratation intense et régénération cellulaire', price: 79.99, icon: '✨' },
    { id: 2, name: 'Huile Précieuse', category: 'Soins Capillaires', description: 'Nourriture et brillance pour vos cheveux', price: 45.50, icon: '💧' },
    { id: 3, name: 'Crème Hydra-Confort', category: 'Soins du Corps', description: 'Douceur et nutrition pour une peau soyeuse', price: 59.99, icon: '🌿' }
  ];

 
  isCollectionDropdownOpen: boolean = false; // Tracks if the collection dropdown is open

  constructor() {}

  ngOnInit(): void {}

  // Method to switch between 'login' and 'signup' forms
  switchAuthTab(tab: 'login' | 'signup'): void {
    this.activeTab = tab;
  }

  // Method to handle sign up form submission
  onSignUp(): void {
    if (this.signUpEmail && this.signUpPassword && this.signUpPassword === this.confirmPassword) {
      // Implement sign-up logic here (e.g., API call)
      console.log('Sign Up successful:', this.signUpEmail, this.signUpPassword);
      // Clear the fields after successful sign-up
      this.clearSignUpFields();
    } else {
      console.error('Password confirmation does not match or fields are empty');
    }
  }

  // Method to handle login form submission
  onLogin(): void {
    if (this.loginEmail && this.loginPassword) {
      // Implement login logic here (e.g., API call)
      console.log('Login successful:', this.loginEmail);
      // Clear login fields after successful login
      this.clearLoginFields();
    } else {
      console.error('Email or password is empty');
    }
  }

  // Method to toggle the collection dropdown menu
  toggleCollectionDropdown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isCollectionDropdownOpen = !this.isCollectionDropdownOpen;
  }

  // Method to close the dropdown menu
  closeDropdown(): void {
    this.isCollectionDropdownOpen = false;
  }

  // Track products by their unique ID for better performance
  trackByProductId(index: number, product: BeautyProduct): number {
    return product.id;
  }

  // Method to navigate to makeup category
  navigateToMakeup(): void {
    // Implement the navigation logic here (e.g., using Router)
  }

  // Helper method to clear sign-up form fields after successful sign-up
  clearSignUpFields(): void {
    this.signUpEmail = '';
    this.signUpPassword = '';
    this.confirmPassword = '';
    this.signupName = '';
  }

  // Helper method to clear login form fields after successful login
  clearLoginFields(): void {
    this.loginEmail = '';
    this.loginPassword = '';
  }
}
