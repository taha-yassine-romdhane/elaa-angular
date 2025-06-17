import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

// Local interface for UI display purposes
interface DisplayProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  skinType?: string[];
  rating: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

@Component({
  selector: 'app-soin-de-visage',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './soin-de-visage.component.html',
  styleUrls: ['./soin-de-visage.component.scss']
})
export class SoinDeVisageComponent implements OnInit {
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/images/placeholder.jpg';
    }
  }
  // Filtres
  categories = [
    { id: 'nettoyants', name: 'Nettoyants', checked: false },
    { id: 'hydratants', name: 'Hydratants', checked: false },
    { id: 'masques', name: 'Masques', checked: false },
    { id: 'serums', name: 'Sérums', checked: false },
    { id: 'cremes', name: 'Crèmes', checked: false },
    { id: 'ecrans', name: 'Écrans solaires', checked: false },
  ];

  skinTypes = [
    { id: 'seche', name: 'Peau sèche', checked: false },
    { id: 'grasse', name: 'Peau grasse', checked: false },
    { id: 'mixte', name: 'Peau mixte', checked: false },
    { id: 'sensible', name: 'Peau sensible', checked: false },
  ];

  priceRanges = [
    { id: '0-50', name: 'Moins de 100TND ', min: 0, max: 50, checked: false },
    { id: '20-70', name: '20TND - 70TND', min: 20, max: 70, checked: false },
    { id: '50-100', name: '50TND - 100TND', min: 50, max: 100, checked: false },
    { id: '100+', name: 'Plus de 100TND', min: 100, max: Infinity, checked: false },
  ];

  // API Products
  apiProducts: Product[] = [];
  
  // Display Products (transformed from API data)
  products: DisplayProduct[] = [];
  
  // Loading and error states
  loading = false;
  error = '';

  // Filtres actifs
  activeFilters: {
    categories: string[],
    skinTypes: string[],
    priceRanges: {min: number, max: number}[]
  } = {
    categories: [],
    skinTypes: [],
    priceRanges: []
  };

  // Produits filtrés
  filteredProducts: DisplayProduct[] = [];
  
  // Search query
  searchQuery = '';

  constructor(private productService: ProductService) {}
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  // Charger les produits depuis l'API
  loadProducts(): void {
    this.loading = true;
    this.error = '';
    
    // CategoryId 3 corresponds to 'Soin Visage'
    this.productService.getProductsByCategory(3).subscribe({
      next: (data) => {
        this.apiProducts = data;
        this.transformProducts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Impossible de charger les produits. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }
  
  // Transformer les produits de l'API en format d'affichage
  transformProducts(): void {
    this.products = this.apiProducts.map(product => {
      // Déterminer la catégorie locale basée sur le nom du produit
      let category = 'hydratants'; // catégorie par défaut
      if (product.name.toLowerCase().includes('nettoyant') || product.name.toLowerCase().includes('gel')) {
        category = 'nettoyants';
      } else if (product.name.toLowerCase().includes('masque')) {
        category = 'masques';
      } else if (product.name.toLowerCase().includes('sérum') || product.name.toLowerCase().includes('serum')) {
        category = 'serums';
      } else if (product.name.toLowerCase().includes('crème') || product.name.toLowerCase().includes('creme')) {
        category = 'cremes';
      } else if (product.name.toLowerCase().includes('solaire') || product.name.toLowerCase().includes('spf')) {
        category = 'ecrans';
      }
      
      // Déterminer le type de peau (simulé)
      const skinType = [];
      if (Math.random() > 0.5) skinType.push('seche');
      if (Math.random() > 0.5) skinType.push('mixte');
      if (Math.random() > 0.7) skinType.push('grasse');
      if (Math.random() > 0.8) skinType.push('sensible');
      
      // S'assurer qu'il y a au moins un type de peau
      if (skinType.length === 0) skinType.push('mixte');
      
      // Générer une note aléatoire entre 3.5 et 5
      const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
      
      return {
        id: product.id,
        name: product.name,
        brand: this.getSupplierName(product),
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        image: this.getMainImage(product),
        category: category,
        skinType: skinType,
        rating: rating,
        isNew: this.isNew(product),
        isBestseller: Math.random() > 0.8
      };
    });
    
    this.filteredProducts = [...this.products];
  }

  getSupplierName(product: Product): string {
    if (product['supplier'] && product['supplier'].name) {
      return product['supplier'].name;
    }
    return 'Elaa Beauty';
  }

  getMainImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find((img: any) => img.isMain);
      return mainImage ? mainImage.url : product.images[0].url;
    }
    return 'assets/images/products/placeholder.jpg';
  }

  isNew(product: Product): boolean {
    if (!product['createdAt']) return false;
    
    const createdDate = new Date(product['createdAt']);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 30; // Consider products added in the last 30 days as new
  }

  // Gestion des filtres
  updateFilters() {
    this.activeFilters.categories = this.categories
      .filter(cat => cat.checked)
      .map(cat => cat.id);

    this.activeFilters.skinTypes = this.skinTypes
      .filter(type => type.checked)
      .map(type => type.id);

    this.activeFilters.priceRanges = this.priceRanges
      .filter(range => range.checked)
      .map(range => ({ min: range.min, max: range.max }));

    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      // Filtre par recherche
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        const query = this.searchQuery.toLowerCase().trim();
        if (!product.name.toLowerCase().includes(query) && 
            !product.brand.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // Filtre par catégorie
      if (this.activeFilters.categories.length > 0 && 
          !this.activeFilters.categories.includes(product.category)) {
        return false;
      }

      // Filtre par type de peau
      if (this.activeFilters.skinTypes.length > 0 && 
          !product.skinType?.some(type => this.activeFilters.skinTypes.includes(type))) {
        return false;
      }

      // Filtre par fourchette de prix
      if (this.activeFilters.priceRanges.length > 0) {
        const priceInRange = this.activeFilters.priceRanges.some(
          range => product.price >= range.min && product.price <= range.max
        );
        if (!priceInRange) return false;
      }

      return true;
    });
  }

  // Réinitialiser les filtres
  resetFilters() {
    this.categories.forEach(cat => cat.checked = false);
    this.skinTypes.forEach(type => type.checked = false);
    this.priceRanges.forEach(range => range.checked = false);
    this.searchQuery = '';
    
    this.activeFilters = {
      categories: [],
      skinTypes: [],
      priceRanges: []
    };
    
    this.filteredProducts = [...this.products];
  }
  
  // Recherche
  onSearch() {
    this.applyFilters();
  }
  
  // Effacer la recherche
  clearSearch() {
    this.searchQuery = '';
    this.applyFilters();
  }

  // Générer les étoiles de notation
  getStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.round(rating));
    }
    return stars;
  }
}