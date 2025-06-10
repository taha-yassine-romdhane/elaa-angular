import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagePlaceholderService {
  private defaultColors: { [key: string]: string } = {
    skincare: '#f3d1d1', // light rose
    makeup: '#e6a4a4',   // medium rose
    parfum: '#d47979',   // dark rose
    nails: '#f5e6d3',    // light beige
    body: '#e6d4c1',     // medium beige
    default: '#d4c1a8'   // dark beige
  };

  private icons: { [key: string]: string } = {
    skincare: '💆‍♀️',
    makeup: '💄',
    parfum: '🌺',
    nails: '💅',
    body: '🧴',
    default: '✨'
  };

  constructor() { }

  /**
   * Generates an SVG placeholder with category-specific styling
   * @param width Width of the placeholder
   * @param height Height of the placeholder
   * @param category Product category (skincare, makeup, etc.)
   * @param text Optional text to display
   * @returns SVG data URL
   */
  generatePlaceholder(width: number = 300, height: number = 300, category: string = 'default', text?: string): string {
    // Determine background color based on category
    const bgColor = this.getCategoryColor(category);
    const icon = this.getCategoryIcon(category);
    
    // Create the SVG content
    const displayText = text || `${category.charAt(0).toUpperCase() + category.slice(1)}`;
    
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="${bgColor}" />
        <text x="50%" y="45%" font-family="Arial" font-size="${width/6}px" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${icon}</text>
        <text x="50%" y="65%" font-family="Arial" font-size="${width/16}px" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${displayText}</text>
      </svg>
    `;
    
    // Convert SVG to data URL
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  /**
   * Gets the appropriate color for a category
   */
  private getCategoryColor(category: string): string {
    const normalizedCategory = this.normalizeCategory(category);
    return this.defaultColors[normalizedCategory] || this.defaultColors['default'];
  }

  /**
   * Gets the appropriate icon for a category
   */
  private getCategoryIcon(category: string): string {
    const normalizedCategory = this.normalizeCategory(category);
    return this.icons[normalizedCategory] || this.icons['default'];
  }

  /**
   * Normalizes category name for matching
   */
  private normalizeCategory(category: string): string {
    const lowerCase = category.toLowerCase();
    
    if (lowerCase.includes('visage') || lowerCase.includes('skin')) {
      return 'skincare';
    } else if (lowerCase.includes('maquillage') || lowerCase.includes('makeup')) {
      return 'makeup';
    } else if (lowerCase.includes('parfum')) {
      return 'parfum';
    } else if (lowerCase.includes('nail') || lowerCase.includes('ongle')) {
      return 'nails';
    } else if (lowerCase.includes('corps') || lowerCase.includes('body')) {
      return 'body';
    }
    
    return 'default';
  }

  /**
   * Safe image URL handler with placeholder fallback
   * @param imageUrl Original image URL
   * @param category Product category
   * @param width Placeholder width
   * @param height Placeholder height
   * @returns Safe image URL or placeholder
   */
  getSafeImageUrl(imageUrl: string, category: string = 'default', width: number = 300, height: number = 300): string {
    if (!imageUrl || imageUrl.includes('placeholder') || imageUrl.includes('undefined')) {
      return this.generatePlaceholder(width, height, category);
    }
    return imageUrl;
  }
}
