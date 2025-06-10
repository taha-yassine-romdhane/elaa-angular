import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MakeupService, MakeupProduct } from './makeup.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-makeup',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  providers: [MakeupService],
  templateUrl: './makeup.component.html',
  styleUrls: ['./makeup.component.scss']
})
export class MakeupComponent implements OnInit {
  products: MakeupProduct[] = [];
  filteredProducts: MakeupProduct[] = [];
  searchTerm = '';
  isLoading = true;
  error: string | null = null;

  constructor(
    private makeupService: MakeupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.error = null;
    
    this.makeupService.getMakeupProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.isLoading = false;
        console.log('Products loaded from API:', products);
      },
      error: (err) => {
        this.error = 'Failed to load products. Using fallback data.';
        this.isLoading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredProducts = [...this.products];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTermLower) ||
      product.category.toLowerCase().includes(searchTermLower) ||
      product.description.toLowerCase().includes(searchTermLower)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.onSearch();
  }

  trackByProductId(index: number, product: MakeupProduct): number {
    return product.id;
  }

  getProductImage(product: MakeupProduct): string {
    return product.images[0] || '/assets/images/placeholder.png';
  }
}