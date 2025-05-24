import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MakeupService } from './makeup.service';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  mainImage: string;
  category: string;
  icon: string;
  images: string[];
  isFavorite?: boolean;
  rating?: number;
  brand?: string;
  shades?: string[];
}

@Component({
  selector: 'app-makeup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [MakeupService],
  templateUrl: './makeup.component.html',
  styleUrls: ['./makeup.component.scss']
})
export class MakeupComponent implements OnInit {
  products: Product[] = [
    {
      id: 1,
      name: "Palette de Makeup Forever",
      mainImage: "/assets/images/products/palettes.jpg",
      category: "Fond de Teint",
      description: "6 fonds de teint crème, 4 blush crème et 2 highlighters.",
      price: 320,
      icon: "palette",
      images: ["/assets/images/products/palettes.jpg"]
    },
    {
      id: 2,
      name: "Rouge à Lèvres YSL",
      mainImage: "/assets/images/products/rouge a levres.jpg",
      category: "Rouge à Lèvres",
      description: "Rouge à lèvres YSL avec une texture velours et une tenue exceptionnelle.",
      price: 178,
      icon: "lipstick",
      images: ["/assets/images/products/rouge a levres.jpg"]
    },
    {
      id: 3,
      name: "Palette d'Yeux Mosaïque",
      mainImage: "/assets/images/categories/givenchy.webp",
      category: "fond de teint",
      description: "Matissime Velvet Fluide.",
      price: 199.99,
      icon: "eye",
      images: ["/assets/images/categories/givenchy.webp"]
    },
    {
      id: 4,
      name: 'Fond de Teint',
      description: 'Fond de teint léger',
      price: 63.840,
      mainImage: '/assets/images/categories/mascara.webp',
      category: 'mascara',
      brand: 'Glamour',
      isFavorite: true,
      rating: 4.5,
      images: ['/assets/images/categories/mascara.webp'],
      icon: 'palette'
    },
    {
      id: 5,
      name: 'Palette Smokey Eyes',
      description: 'Palette de fards à paupières pour un look dramatique',
      price: 178,
      mainImage: '/assets/images/categories/dior.avif',
      category: 'eyeshadow',
      brand: 'Luxe Eyes',
      isFavorite: false,
      rating: 4.2,
      images: ['/assets/images/categories/dior.avif'],
      icon: 'eye'
    },
    {
      id: 6,
      name: 'Blush Éclat Naturel',
      description: 'Blush effet bonne mine, texture légère',
      price: 198,
      mainImage: '/assets/images/categories/blush.png',
      category: 'blush',
      images: ['/assets/images/categories/blush.png'],
      icon: 'heart'
    },
    {
      id: 7,
      name: 'Eyeliner YSL',
      description: 'eyeliner longue tenue',
      price: 28,
      mainImage: '/assets/images/categories/blueyeliner.jpg',
      category: 'eyeliner',
      images: ['/assets/images/categories/eyeliner.jpg'],
      icon: 'heart'
    },
    {
      id: 8,
      name: 'Highlighter',
      description: 'eyeliner longue tenue',
      price: 49,
      mainImage: '/assets/images/categories/highlighter.jpg',
      category: 'highlighter',
      images: ['/assets/images/categories/highlighter.jpg'],
      icon: 'heart'
    },
  ];
  filteredProducts: Product[] = [];
  searchTerm = '';

  constructor(
    private makeupService: MakeupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    console.log('Produits chargés:', this.products);
  }

  loadProducts() {
    this.filteredProducts = [...this.products];
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

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  getProductImage(product: Product): string {
    return product.images[0] || '/assets/images/placeholder.png';
  }
}