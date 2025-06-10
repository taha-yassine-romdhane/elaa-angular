import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-parfums',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './parfums.component.html',
  styleUrls: ['./parfums.component.scss']
})
export class ParfumsComponent {
maxPrice: any;
minPrice: any;
clearSearch() {
throw new Error('Method not implemented.');
}
onSearch() {
throw new Error('Method not implemented.');
}
  priceMin: number = 32000;
  priceMax: number = 1230000;
  parfums: any[] = [
    {
      id: 1,
      name: 'Miss Dior',
      brand: 'Dior',
      price: 65000,
      image: 'assets/images/parfum/miss-dior.jpg',
      volume: '100ml'
    },
    {
      id: 2,
      name: "J'adore",
      brand: 'Dior',
      price: 75000,
      image: 'assets/images/parfum/dior1.webp',
      volume: '100ml'
    },
    {
      id: 3,
      name: 'Libre',
      brand: 'Yves Saint Laurent',
      price: 80000,
      image: 'assets/images/parfum/libre.webp',
      volume: '100ml'
    },
    {
      id: 4,
      name: 'Givenchy',
      brand: 'Givenchy',
      price: 70000,
      image: 'assets/images/parfum/givenchy.jpg',
      volume: '100ml'
    },
    {
      id: 5,
      name: 'Coffret Dior',
      brand: 'Dior',
      price: 120000,
      image: 'assets/images/parfum/coffret dior.png',
      volume: '100ml'
    }
  ];
marques: any;
searchQuery: any;

  get formattedPrice(): string {
    return `${this.priceMin.toLocaleString('fr-TN')} TND - ${this.priceMax.toLocaleString('fr-TN')} TND`;
  }

  onPriceChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.priceMin = Number(value);
  }
}
