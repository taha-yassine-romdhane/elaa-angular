import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImagePlaceholderService } from '../services/image-placeholder.service';

export interface Category {
  name: string;
  Image: string;
  icon: string;
  thumbnail?: string;
}

export interface Product {
  id: number;
  name: string;
  mainImage: string;
  category: string;
  description: string;
  price: number;
  icon?: string;
  hoverImage?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isCollectionDropdownOpen = false;
  isMobileMenuOpen = false;


  collectionCategories = [
    { name: 'Soins de la Peau', path: 'soins-de-la-peau' },
    { name: 'Maquillage', path: 'maquillage' },
    { name: 'Parfums', path: 'parfums' }
  ];

  beautyCategories: Category[] = [
    {
      name: 'Soins Visage',
      Image: 'assets/Images/categories/skincare.jpg',
      icon: '💆‍♀️',
      thumbnail: 'assets/Images/categories/la roche.jpg'
    },
    {
      name: 'Soins Corps',
      Image: 'assets/Images/categories/bodycare.jpg',
      icon: '💪',
      thumbnail: 'assets/Images/categories/mixa.jpg'
    },
    {
      name: 'Soins nails',
      Image: 'assets/Images/categories/nails.jpg',
      icon: '💅',
      thumbnail: 'assets/Images/categories/nails2.jpg'
    }
  ];

  featuredProducts: Product[] = [
    {
      id: 1,
      name: 'Palette Nude Élégance',
      mainImage: 'assets/Images/products/palettes.jpg',
      category: 'Maquillage',
      description: '15 nuances nuables et pigmentées',
      price: 49.99,
      icon: '🎨'
    },
    {
      id: 2,
      name: 'Sérum Hydratant Intense',
      mainImage: 'assets/Images/products/serum.jpg',
      category: 'Soins de la Peau',
      description: 'Hydratation profonde pour une peau éclatante',
      price: 39.50,
      icon: '💧'
    },
    {
      id: 3,
      name: 'Parfum Floral Mystique',
      mainImage: 'assets/Images/products/parfum.jpg',
      category: 'Parfums',
      description: 'Un mélange envoûtant de notes florales et boisées',
      price: 79.99,
      icon: '🌺'
    },
    {
      id: 4,
      name: 'Rouge à Lèvres Velours',
      mainImage: 'assets/Images/products/rouge-levres.jpg',
      category: 'Maquillage',
      description: 'Couleur intense et texture veloutée',
      price: 24.99,
      icon: '💄'
    },
    {
      id: 5,
      name: 'Crème Corporelle Nourrissante',
      mainImage: 'assets/Images/products/creme-corps.jpg',
      category: 'Soins de la Peau',
      description: 'Hydratation 24h pour une peau douce et satinée',
      price: 29.90,
      icon: '🧴'
    }
  ];

  // Removed heroCategories as we're using beautyCategories instead
  

  constructor(private router: Router, public imagePlaceholderService: ImagePlaceholderService) {}

  ngOnInit(): void {}

  navigateToMakeup() {
    this.router.navigate(['/maquillage']);
    this.closeDropdown();
  }

  toggleCollectionDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isCollectionDropdownOpen = !this.isCollectionDropdownOpen;
  }

  closeDropdown(): void {
    this.isCollectionDropdownOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.collection-dropdown')) {
      this.isCollectionDropdownOpen = false;
    }
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  /**
   * Gets a safe image URL with placeholder fallback
   */
  getProductImage(product: Product): string {
    // First try to use the product's mainImage if it exists
    if (product.mainImage && !product.mainImage.includes('undefined')) {
      return product.mainImage;
    }
    
    // If no valid mainImage, generate a placeholder based on category
    const category = product.category || 'default';
    return this.imagePlaceholderService.generatePlaceholder(300, 300, category, product.name);
  }

  /**
   * Gets a category image with placeholder fallback
   */
  getCategoryImage(category: Category): string {
    // First try to use the category's Image if it exists
    if (category.Image && !category.Image.includes('undefined')) {
      return category.Image;
    }
    
    // If no valid Image, generate a placeholder
    return this.imagePlaceholderService.generatePlaceholder(300, 300, category.name);
  }

  /**
   * Gets a category thumbnail with placeholder fallback
   */
  getCategoryThumbnail(category: Category): string {
    // First try to use the category's thumbnail if it exists
    if (category.thumbnail && !category.thumbnail.includes('undefined')) {
      return category.thumbnail;
    }
    
    // If no valid thumbnail, generate a placeholder
    return this.imagePlaceholderService.generatePlaceholder(150, 150, category.name);
  }
}
