import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-parfums',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './parfums.component.html',
  styleUrls: ['./parfums.component.scss']
})
export class ParfumsComponent implements OnInit {
  // Filter properties
  maxPrice: number = 1230000;
  minPrice: number = 0;
  priceMin: number = 32000;
  priceMax: number = 1230000;
  searchQuery: string = '';
  marques: string[] = [];
  
  // Data properties
  parfums: Product[] = [];
  filteredParfums: Product[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  
  // Category ID for parfums
  private readonly PARFUMS_CATEGORY_ID = 2; // Based on the example data
  
  constructor(private productService: ProductService) {}
  
  ngOnInit(): void {
    this.loadParfums();
  }
  
  loadParfums() {
    this.isLoading = true;
    this.error = null;
    
    this.productService.getProductsByCategory(this.PARFUMS_CATEGORY_ID)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (products) => {
          this.parfums = products;
          this.filteredParfums = [...products];
          console.log('Parfums loaded:', products);
          this.updateFilters();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error loading parfums:', err);
          
          if (err.status === 401) {
            this.error = 'Vous devez être connecté pour accéder à cette page. Veuillez vous connecter.';
          } else {
            this.error = 'Impossible de charger les parfums. Veuillez réessayer plus tard.';
          }
        }
      });
  }
  
  updateFilters(): void {
    // Extract unique brands for the filter
    const uniqueBrands = new Set<string>();
    this.parfums.forEach(product => {
      const supplierName = this.getSupplierName(product);
      if (supplierName) {
        uniqueBrands.add(supplierName);
      }
    });
    this.marques = Array.from(uniqueBrands);
    
    // Update price range
    if (this.parfums.length > 0) {
      this.minPrice = Math.min(...this.parfums.map(p => Number(p.price)));
      this.maxPrice = Math.max(...this.parfums.map(p => Number(p.price)));
      this.priceMin = this.minPrice;
      this.priceMax = this.maxPrice;
    }
  }
  
  getSupplierName(product: Product): string {
    if (product['supplier'] && product['supplier'].name) {
      return product['supplier'].name;
    }
    return 'Elaa Beauty';
  }
  
  clearSearch(): void {
    this.searchQuery = '';
    this.onSearch();
  }
  
  onSearch(): void {
    this.applyFilters();
  }
  
  applyFilters(): void {
    this.filteredParfums = this.parfums.filter(product => {
      // Apply search filter
      const searchMatch = !this.searchQuery || 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (this.getSupplierName(product) && this.getSupplierName(product).toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      // Apply price filter
      const priceMatch = Number(product.price) >= this.priceMin && Number(product.price) <= this.maxPrice;
      
      return searchMatch && priceMatch;
    });
  }

  get formattedPrice(): string {
    return `${this.priceMin.toLocaleString('fr-TN')} TND - ${this.priceMax.toLocaleString('fr-TN')} TND`;
  }

  onPriceChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.priceMin = Number(value);
    this.applyFilters();
  }
  
  // Helper method to get product image
  getProductImage(product: Product): string {
    // Check if product has images and return the main one
    const mainImage = this.getMainImage(product);
    return mainImage ? mainImage : 'assets/images/products/placeholder.jpg';
  }
  
  getMainImage(product: Product): string | null {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find((img: any) => img.isMain);
      return mainImage ? mainImage.url : product.images[0].url;
    }
    return null;
  }
}
