export interface Brand {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  [key: string]: any; // For additional properties
}
