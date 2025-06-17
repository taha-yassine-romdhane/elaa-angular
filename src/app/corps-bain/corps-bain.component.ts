import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interface for transformed product data
interface DisplayProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  isNew: boolean;
  isBestseller: boolean;
  category: string;
  skinType?: string[];
}

@Component({
  selector: 'app-corps-bain',
  imports: [HeaderComponent, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './corps-bain.component.html',
  styleUrl: './corps-bain.component.scss'
})
export class CorpsBainComponent implements OnInit {
  // Make Math available to the template
  Math = Math;
  // API products data
  apiProducts: Product[] = [];
  
  // Transformed products for display
  products: DisplayProduct[] = [];
  filteredProducts: DisplayProduct[] = [];
  
  // Filter options
  categories: string[] = [];
  selectedCategories: string[] = [];
  skinTypes: string[] = ['Normale', 'Sèche', 'Grasse', 'Mixte', 'Sensible'];
  selectedSkinTypes: string[] = [];
  priceRanges = [
    { label: 'Moins de 20€', min: 0, max: 20 },
    { label: '20€ - 50€', min: 20, max: 50 },
    { label: '50€ - 100€', min: 50, max: 100 },
    { label: 'Plus de 100€', min: 100, max: Infinity }
  ];
  selectedPriceRanges: { min: number, max: number }[] = [];
  
  // Search
  searchQuery = '';
  
  // Sort
  sortOption = 'popularity';
  
  // Loading and error states
  loading = false;
  error = '';
  
  constructor(private productService: ProductService) {}
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.loading = true;
    this.error = '';
    
    // CategoryId 4 corresponds to 'Corps & Bain'
    this.productService.getProductsByCategory(4).subscribe({
      next: (data) => {
        this.apiProducts = data;
        this.transformProducts();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Une erreur est survenue lors du chargement des produits. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }
  
  transformProducts(): void {
    // Extract unique categories from product names
    const categorySet = new Set<string>();
    
    this.products = this.apiProducts.map(product => {
      // Extract category from product name
      let category = 'Corps';
      if (product.name.toLowerCase().includes('bain')) category = 'Bain';
      if (product.name.toLowerCase().includes('douche')) category = 'Douche';
      if (product.name.toLowerCase().includes('huile')) category = 'Huiles';
      if (product.name.toLowerCase().includes('crème') || product.name.toLowerCase().includes('creme')) category = 'Crèmes';
      
      categorySet.add(category);
      
      // Randomly assign skin type tags
      const skinType = Math.random() > 0.5 ? 
        [this.skinTypes[Math.floor(Math.random() * this.skinTypes.length)]] : 
        [];
      
      // Generate random rating between 3 and 5
      const rating = Math.floor(Math.random() * 2) + 3 + Math.random();
      
      return {
        id: product.id,
        name: product.name,
        brand: product.brand?.name || (product['supplier']?.name || 'Elaa Beauty'),
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        image: this.getMainImage(product),
        rating,
        ratingCount: Math.floor(Math.random() * 100) + 10,
        isNew: Math.random() > 0.7,
        isBestseller: Math.random() > 0.8,
        category,
        skinType
      };
    });
    
    // Update categories filter options
    this.categories = Array.from(categorySet).sort();
  }
  
  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      // Apply category filter
      if (this.selectedCategories.length > 0 && !this.selectedCategories.includes(product.category)) {
        return false;
      }
      
      // Apply skin type filter
      if (this.selectedSkinTypes.length > 0 && 
          (!product.skinType || !product.skinType.some(type => this.selectedSkinTypes.includes(type)))) {
        return false;
      }
      
      // Apply price range filter
      if (this.selectedPriceRanges.length > 0 && 
          !this.selectedPriceRanges.some(range => 
            product.price >= range.min && product.price <= range.max)) {
        return false;
      }
      
      // Apply search filter
      if (this.searchQuery && 
          !product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) && 
          !product.brand.toLowerCase().includes(this.searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    // Apply sorting
    this.applySorting();
  }
  
  applySorting(): void {
    switch (this.sortOption) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
      default:
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
    }
  }
  
  toggleCategoryFilter(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.applyFilters();
  }
  
  toggleSkinTypeFilter(skinType: string): void {
    const index = this.selectedSkinTypes.indexOf(skinType);
    if (index === -1) {
      this.selectedSkinTypes.push(skinType);
    } else {
      this.selectedSkinTypes.splice(index, 1);
    }
    this.applyFilters();
  }
  
  togglePriceRangeFilter(range: { min: number, max: number }): void {
    const index = this.selectedPriceRanges.findIndex(r => r.min === range.min && r.max === range.max);
    if (index === -1) {
      this.selectedPriceRanges.push(range);
    } else {
      this.selectedPriceRanges.splice(index, 1);
    }
    this.applyFilters();
  }
  
  isPriceRangeSelected(range: { min: number, max: number }): boolean {
    return this.selectedPriceRanges.some(r => r.min === range.min && r.max === range.max);
  }
  
  onSearchChange(): void {
    this.applyFilters();
  }
  
  onSortChange(): void {
    this.applySorting();
  }
  
  clearAllFilters(): void {
    this.selectedCategories = [];
    this.selectedSkinTypes = [];
    this.selectedPriceRanges = [];
    this.searchQuery = '';
    this.applyFilters();
  }
  
  getMainImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find((img: any) => img.isMain);
      return mainImage ? mainImage.url : product.images[0].url;
    }
    return 'assets/images/products/placeholder.jpg';
  }
}
