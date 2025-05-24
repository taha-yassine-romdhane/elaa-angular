import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  cartItemCount = 0;

  // You can add methods for search, cart, and login functionality
  onSearch() {
    // Implement search logic
  }

  onCartClick() {
    // Navigate to cart or show cart modal
  }

  onLoginClick() {
    // Open login modal or navigate to login page
  }
  

}

