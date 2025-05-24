import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-pannier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pannier.component.html',
  styleUrls: ['./pannier.component.scss']
})
export class PannierComponent {
  cartItems: CartItem[] = [
    {
      name: 'Crème hydratante',
      price: 25.99,
      quantity: 1,
      image: 'assets/images/products/creme-hydratante.jpg'
    },
    {
      name: 'Rouge à lèvres',
      price: 15.5,
      quantity: 2,
      image: 'assets/images/products/rouge-levres.jpg'
    }
  ];

  increment(item: CartItem) {
    item.quantity++;
  }

  decrement(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  remove(item: CartItem) {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
