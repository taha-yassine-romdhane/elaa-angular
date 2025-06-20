import { Injectable } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import { ProductImage, ProductService } from '../services/product.service';
import { Product as BackendProduct } from '../models/product.model';
import { AssetService } from '../services/asset.service';

export interface MakeupProduct {
  id: number;
  name: string;
  mainImage: string;
  category: string;
  description: string;
  price: number;
  icon: string;
  images: string[];
  isFavorite?: boolean;
  rating?: number;
  brand?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MakeupService {
  // Fallback data in case API is not available
  private fallbackProducts: MakeupProduct[] = [
    {
      id: 1,
      name: "Fond de teint Fluide",
      mainImage: "/assets/images/products/fond-teint.jpg",
      category: "Fond de Teint",
      description: "Fond de teint fluide à longue tenue pour un teint naturel et lumineux.",
      price: 129.99,
      icon: "palette",
      images: ["/assets/images/products/fond-teint.jpg"]
    },
    {
      id: 2,
      name: "Rouge à Lèvres Mat Velvet",
      mainImage: "/assets/images/products/rouge-a-levres.jpg",
      category: "Rouge à Lèvres",
      description: "Rouge à lèvres mat avec une texture velours et une tenue exceptionnelle.",
      price: 79.99,
      icon: "lipstick",
      images: ["/assets/images/products/rouge-a-levres.jpg"]
    },
    {
      id: 3,
      name: "Palette d'Yeux Mosaïque",
      mainImage: "/assets/images/products/palette-yeux.jpg",
      category: "Palettes",
      description: "Palette d'ombres à paupières avec 12 teintes mates et brillantes.",
      price: 199.99,
      icon: "eye",
      images: ["/assets/images/products/palette-yeux.jpg"]
    }
  ];

  constructor(
    private productService: ProductService,
    private assetService: AssetService
  ) {}

  getMakeupProducts(): Observable<MakeupProduct[]> {
    // Fetch products by category ID 1 (Makeup)
    return this.productService.getProductsByCategory(1).pipe(
      map(backendProducts => this.convertToMakeupProducts(backendProducts)),
      catchError(error => {
        console.error('Error fetching makeup products from API:', error);
        return of(this.fallbackProducts);
      })
    );
  }

  private convertToMakeupProducts(backendProducts: BackendProduct[]): MakeupProduct[] {
    return backendProducts.map(product => {
      // Find main image or use first image
      const mainImage = this.getMainImage(product.images);
      
      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        mainImage: mainImage,
        category: product.category?.name || 'Makeup',
        icon: this.getCategoryIcon(product['categoryId']),
        images: product.images && product.images.length > 0 
          ? product.images.map((img: { id: number; url: string; isMain?: boolean; productId?: number }) => 
              this.assetService.getAssetUrl(img.url)
            ) 
          : [this.assetService.getAssetUrl('/assets/images/placeholder-mascara.png')],
        brand: product.brand?.name 
      };
    });
  }
  
  private getMainImage(images?: Array<{ id: number; url: string; isMain?: boolean; productId?: number }>): string {
    if (!images || images.length === 0) {
      return this.assetService.getAssetUrl('/assets/images/placeholder-mascara.png');
    }
    
    // Find main image or use first image
    const mainImg = images.find(img => img.isMain);
    return this.assetService.getAssetUrl(mainImg ? mainImg.url : images[0].url);
  }

  private getCategoryIcon(categoryId: number): string {
    // Map category IDs to icons - adjust based on your actual categories
    const iconMap: {[key: number]: string} = {
      1: 'palette', // Assuming 1 is foundation
      2: 'lipstick', // Assuming 2 is lipstick
      3: 'eye', // Assuming 3 is eye makeup
      // Add more mappings as needed
    };
    
    return iconMap[categoryId] || 'palette';
  }
}
