import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Product {
  id: number;
  name: string;
  mainImage: string;
  category: string;
  description: string;
  price: number;
  icon: string;
  images: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MakeupService {
  private products: Product[] = [
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

  getMakeupProducts(): Observable<Product[]> {
    return of(this.products);
  }
}
