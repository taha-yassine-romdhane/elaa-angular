export interface Category {
  id: number;
  name: string;
  description?: string;
  [key: string]: any; // For additional properties
}
