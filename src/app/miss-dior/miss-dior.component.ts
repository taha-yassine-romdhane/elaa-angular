import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-miss-dior',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './miss-dior.component.html',
  styleUrl: './miss-dior.component.scss'
})
export class MissDiorComponent {
  currentImage = 'assets/images/parfum/miss dior.jpg';
  selectedSize = '50ml';

  sizes = [
    { size: '30ml', price: 395 },
    { size: '50ml', price: 495 },
    { size: '100ml', price: 695 }
  ];

  get currentPrice(): number {
    const selected = this.sizes.find(s => s.size === this.selectedSize);
    return selected ? selected.price : this.sizes[1].price; // default to 50ml price
  }

  changeMainImage(newImage: string) {
    this.currentImage = newImage;
  }

  changeSize(size: string) {
    this.selectedSize = size;
  }
}
