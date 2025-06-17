import { Category } from './category.model';
import { Brand } from './brand.model';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: Category;
  brand?: Brand;
  images?: { id: number; url: string; }[];
  [key: string]: any; // For additional properties
}
