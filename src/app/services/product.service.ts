import { Injectable } from '@angular/core';
import { MakeupProduct } from '../makeup/makeup.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Exemple de méthode pour récupérer des produits (à adapter selon tes besoins)
  getProducts(): MakeupProduct[] {
    return [];
  }
}
