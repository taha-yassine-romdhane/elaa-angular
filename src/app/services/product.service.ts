import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Brand } from '../models/brand.model';
import { AssetService } from './asset.service';

// Using centralized models from models directory

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  url: string;
  isMain: boolean;
  productId: number;
}

export interface ProductSize {
  id: number;
  name: string;
  stock: number;
  productId: number;
  sku: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private assetService: AssetService
  ) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => this.processProductImages(products))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map(product => this.processProductImage(product))
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/by-category`, {
      params: { categoryId: categoryId.toString() }
    }).pipe(
      map(products => this.processProductImages(products))
    );
  }

  getProductsByBrand(brandId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/brand/${brandId}`).pipe(
      map(products => this.processProductImages(products))
    );
  }
  
  /**
   * Process product images to use absolute URLs
   */
  private processProductImages(products: Product[]): Product[] {
    return products.map(product => this.processProductImage(product));
  }
  
  /**
   * Process a single product's images to use absolute URLs
   */
  private processProductImage(product: Product): Product {
    if (product.images && product.images.length > 0) {
      product.images = product.images.map(image => ({
        ...image,
        url: this.assetService.getAssetUrl(image.url)
      }));
    }
    return product;
  }
}
