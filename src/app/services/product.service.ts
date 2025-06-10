import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  price: number;
  color?: string;
  description?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  supplierId: number;
  categoryId: number;
  brandId?: number;
  images?: ProductImage[];
  sizes?: ProductSize[];
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

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getProductsByBrand(brandId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/brand/${brandId}`);
  }
}
