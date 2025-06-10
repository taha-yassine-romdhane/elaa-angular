import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

interface Product {
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
export class SoinDeVisageComponent {
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

  // Produits
  products: Product[] = [
    {
      id: 1,
      name: 'Crème Hydratante Intense',
      brand: 'La Roche-Posay',
      price: 18.50,
      image: 'assets/images/categories/laroche.webp',
      category: 'hydratants',
      skinType: ['seche', 'sensible'],
      rating: 4.5,
      isBestseller: true
    },
    {
      id: 2,
      name: 'Sérum Vitamine C',
      brand: 'SVR',
      price: 12.90,
      image: 'assets/images/categories/vitamine c.jpg',
      category: 'serums',
      skinType: ['mixte', 'grasse'],
      rating: 4.7,
      isNew: true
    },
    {
      id: 3,
      name: 'Gel Nettoyant ',
      brand: 'Avéne',
      price: 14.90,
      image: 'assets/images/categories/gel avéne.jpg',
      category: 'nettoyants',
      skinType: ['mixte'],
      rating: 4.6
    },
    {
      id: 4,
      name: 'Masque Purifiant',
      brand: 'SVR',
      price: 32.00,
      image: 'assets/images/categories/masque.webp',
      category: 'masques',
      skinType: ['grasse', 'mixte'],
      rating: 4.4
    },
    {
      id: 5,
      name: 'Crème Solaire SPF 50+',
      brand: 'La Roche-Posay',
      price: 22.90,
      image: 'assets/images/categories/ecranlaroche.jpg',
      category: 'ecrans',
      skinType: ['seche', 'mixte', 'sensible'],
      rating: 4.8,
      isBestseller: true
    },
    {
      id: 6,
      name: 'B3 Ampoule hydra',
      brand: 'SVR',
      price: 6.80,
      image: 'assets/images/categories/B3.webp',
      category: 'serums',
      skinType: ['seche', 'sensible'],
      rating: 4.5
    },
    {
      id: 7,
      name: 'Gel nettoyant ducray',
      brand: 'Ducray',
      price: 6.80,
      image: 'assets/images/categories/gelducray.webp',
      category: 'nettoyants',
      skinType: ['seche', 'sensible'],
      rating: 4.5
    },
    {
      id: 8,
      name: 'pack Laino',
      brand: 'Laino',
      price: 6.80,
      image: 'assets/images/categories/Laino.webp',
      category: 'nettoyants',
      skinType: ['seche', 'sensible'],
      rating: 4.5
    },
    {
      id: 9,
      name: 'pack SVR',
      brand: 'SVR',
      price: 6.80,
      image: 'assets/images/categories/pack svr.webp',
      category: 'nettoyants',
      skinType: ['seche', 'sensible'],
      rating: 4.5
    },
  ];

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
  filteredProducts: Product[] = [];

  constructor() {
    this.filteredProducts = [...this.products];
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
    
    this.activeFilters = {
      categories: [],
      skinTypes: [],
      priceRanges: []
    };
    
    this.filteredProducts = [...this.products];
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