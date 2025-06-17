import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  /**
   * Creates a full URL for an asset path
   * @param path The relative path of the asset
   * @returns Full URL including the base URL
   */
  getAssetUrl(path: string): string {
    // If the path is already an absolute URL, return it as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // If the path starts with 'assets/', ensure it doesn't have a leading slash
    if (path.startsWith('assets/')) {
      return `${environment.assetsBaseUrl}/${path}`;
    }
    
    // If the path is relative but doesn't start with 'assets/', add it
    if (!path.startsWith('/')) {
      return `${environment.assetsBaseUrl}/assets/images/${path}`;
    }
    
    // Handle /uploads/ paths (product images)
    if (path.startsWith('/uploads/')) {
      return `${environment.assetsBaseUrl}${path}`;
    }
    
    // If the path starts with a slash, remove it before combining
    return `${environment.assetsBaseUrl}${path}`;
  }
}
