import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
interface Product {
  id: number;
  name: string;
  category?: string;
  description?: string;
  price: number;
  mainImage: string;
  hoverImage?: string;
  icon?: string;
}

interface Category {
  name: string;
  Image: string;
  thumbnail?: string;
  icon?: string;
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

  heroCategories: Category[] = [
    {
      name: 'Soins de la Peau',
      Image: 'assets/Images/skincare.jpg',
      icon: '💆‍♀️'
    },
    {
      name: 'Maquillage',
      Image: 'assets/Images/makeup.jpg',
      icon: '💄'
    },
    {
      name: 'Parfums',
      Image: 'assets/Images/perfume.jpg',
      icon: '🌹'
    }
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
      Image: 'assets/Images/categories/soin nails.jpg',
      icon: '💇‍♀️'
    }
  ];

  constructor(private router: Router) {}

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

  getProductImage(product: Product): string {
    const imageMap: { [key: string]: string[] } = {
      'Parfums': [
        'assets/images/categories/parfums.jpg',
        'assets/images/categories/la roche.jpg'
      ],
      'Maquillage': [
        'assets/images/categories/makeup2.jpg',
        'assets/images/categories/rouge a levres.jpg'
      ],
      'Soins de la Peau': [
        'assets/images/categories/skincare.jpg',
        'assets/images/categories/skincare2.jpg'
      ],
      'default': [
        'assets/images/categories/mixa.jpg',
        'assets/images/categories/bodycare.jpg'
      ]
    };

    const category = product.category || 'default';
    const images = imageMap[category] || imageMap['default'];
    const index = this.featuredProducts.indexOf(product) % images.length;

    return images[index];
  }
}
