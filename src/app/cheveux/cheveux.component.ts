import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { AssetService } from '../services/asset.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Brand } from '../models/brand.model';

interface DisplayProduct extends Omit<Product, 'category' | 'brand'> {
  image: string;
  category: string; // String category name for display
  categoryObj?: Category; // Original category object
  skinType: string;
  rating: number;
  ratingCount: number;
  isNew: boolean;
  isBestseller: boolean;
  brand: string; // String brand name for display
  brandObj?: Brand; // Original brand object
}

@Component({
  selector: 'app-cheveux',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './cheveux.component.html',
  styleUrls: ['./cheveux.component.scss']
})
export class CheveuxComponent implements OnInit {
  // Make Math available to the template
  Math = Math;
  // API products data
  apiProducts: Product[] = [];
  
  // Displayed products after filtering
  filteredProducts: DisplayProduct[] = [];
  
  // Loading and error states
  loading = true;
  error: string | null = null;
  
  // Filter options
  categories: string[] = [];
  skinTypes: string[] = ['Normale', 'Sèche', 'Grasse', 'Mixte', 'Sensible'];
  priceRanges = [
    { min: 0, max: 20, label: 'Moins de 20€' },
    { min: 20, max: 50, label: '20€ - 50€' },
    { min: 50, max: 100, label: '50€ - 100€' },
    { min: 100, max: Infinity, label: 'Plus de 100€' }
  ];
  
  // Selected filters
  selectedCategories: string[] = [];
  selectedSkinTypes: string[] = [];
  selectedPriceRanges: { min: number, max: number }[] = [];
  searchQuery = '';
  
  // Sorting
  sortOption = 'popularity';
  
  constructor(
    private productService: ProductService,
    private assetService: AssetService
  ) { }
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProductsByCategory(5).subscribe({
      next: (products) => {
        this.apiProducts = products;
        this.processProducts();
        this.extractCategories();
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
  
  processProducts(): void {
    this.filteredProducts = this.apiProducts.map(product => {
      // Extract category from product name
      const nameParts = product.name.split(' ');
      const possibleCategories = ['Shampooing', 'Après-shampooing', 'Masque', 'Sérum', 'Huile', 'Spray', 'Gel', 'Mousse'];
      const category = possibleCategories.find(cat => product.name.includes(cat)) || 'Autre';
      
      // Generate random skin type, rating, etc. for demo purposes
      const skinType = this.skinTypes[Math.floor(Math.random() * this.skinTypes.length)];
      const rating = 3 + Math.random() * 2; // Rating between 3 and 5
      const ratingCount = Math.floor(Math.random() * 100) + 5;
      const isNew = Math.random() > 0.7;
      const isBestseller = Math.random() > 0.8;
      
      // Get image using helper method
      const imageUrl = this.getMainImage(product);
      
      return {
        ...product,
        image: imageUrl,
        category,
        categoryObj: product.category,
        skinType,
        rating,
        ratingCount,
        isNew,
        isBestseller,
        brand: product.brand?.name || 'Elaa Beauty',
        brandObj: product.brand
      } as DisplayProduct;
    });
  }
  
  extractCategories(): void {
    const categorySet = new Set<string>();
    this.filteredProducts.forEach(product => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    this.categories = Array.from(categorySet);
  }
  
  applyFilters(): void {
    // First convert API products to DisplayProducts
    let displayProducts = this.apiProducts.map(product => {
      // Extract category from product name
      const nameParts = product.name.split(' ');
      const possibleCategories = ['Shampooing', 'Après-shampooing', 'Masque', 'Sérum', 'Huile', 'Spray', 'Gel', 'Mousse'];
      const category = possibleCategories.find(cat => product.name.includes(cat)) || 'Autre';
      
      // Generate random skin type, rating, etc. for demo purposes
      const skinType = this.skinTypes[Math.floor(Math.random() * this.skinTypes.length)];
      const rating = 3 + Math.random() * 2; // Rating between 3 and 5
      const ratingCount = Math.floor(Math.random() * 100) + 5;
      const isNew = Math.random() > 0.7;
      const isBestseller = Math.random() > 0.8;
      
      // Get image using helper method
      const imageUrl = this.getMainImage(product);
      
      return {
        ...product,
        image: imageUrl,
        category,
        categoryObj: product.category,
        skinType,
        rating,
        ratingCount,
        isNew,
        isBestseller,
        brand: product.brand?.name || 'Elaa Beauty',
        brandObj: product.brand
      } as DisplayProduct;
    });
    
    // Apply category filter
    if (this.selectedCategories.length > 0) {
      displayProducts = displayProducts.filter(product => 
        this.selectedCategories.includes(product.category)
      );
    }
    
    // Apply skin type filter
    if (this.selectedSkinTypes.length > 0) {
      displayProducts = displayProducts.filter(product => 
        this.selectedSkinTypes.includes(product.skinType)
      );
    }
    
    // Apply price range filter
    if (this.selectedPriceRanges.length > 0) {
      displayProducts = displayProducts.filter(product => {
        const price = parseFloat(product['price'].toString());
        return this.selectedPriceRanges.some(range => 
          price >= range.min && price <= range.max
        );
      });
    }
    
    // Apply search filter
    if (this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      displayProducts = displayProducts.filter(product => 
        product['name'].toLowerCase().includes(query) || 
        (product['description'] && product['description'].toLowerCase().includes(query)) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (this.sortOption) {
      case 'price-asc':
        displayProducts.sort((a, b) => parseFloat(a['price'].toString()) - parseFloat(b['price'].toString()));
        break;
      case 'price-desc':
        displayProducts.sort((a, b) => parseFloat(b['price'].toString()) - parseFloat(a['price'].toString()));
        break;
      case 'name':
        displayProducts.sort((a, b) => a['name'].localeCompare(b['name']));
        break;
      case 'popularity':
      default:
        // Sort by rating for popularity
        displayProducts.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    this.filteredProducts = displayProducts;
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
    this.applyFilters();
  }
  
  clearAllFilters(): void {
    this.selectedCategories = [];
    this.selectedSkinTypes = [];
    this.selectedPriceRanges = [];
    this.searchQuery = '';
    this.sortOption = 'popularity';
    this.applyFilters();
  }
  
  getMainImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find((img: any) => img.isMain);
      return this.assetService.getAssetUrl(mainImage ? mainImage.url : product.images[0].url);
    }
    return this.assetService.getAssetUrl('images/products/placeholder.jpg');
  }
}
