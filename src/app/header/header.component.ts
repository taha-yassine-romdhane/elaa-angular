import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  perfumeMenu = {
    promotions: [
      'Voir tout',
      'Idées cadeaux parfum ❤️',
      'Parfums à petits prix',
      'Nouveautés'
    ],
    brands: [
      'Top marques parfum',
      'Dior',
      'Chanel',
      'Yves Saint Laurent'
    ],
    women: {
      title: 'Parfum femme',
      items: [
        'Eau de parfum',
        'Eau de toilette',
        'Parfum cheveux',
        'Soin corps parfumé'
      ]
    },
    men: {
      title: 'Parfum homme',
      items: [
        'Eau de parfum',
        'Eau de toilette',
        'Eau de cologne',
        'Déodorant'
      ]
    },
    other: [
      'Parfum enfant',
      'Parfum d\'exception',
      'Gravure personnalisée 🎁',
      'Parfums rechargeables',
      'Bien-être'
    ],
    notes: {
      title: 'Notes olfactives',
      items: [
        'Parfum vanillé',
        'Parfum floral',
        'Parfum ambré',
        'Parfum boisé'
      ]
    },
    sets: {
      title: 'Coffret parfum',
      items: [
        'Coffret parfum femme',
        'Coffret parfum homme',
        'Coffret parfum enfant'
      ]
    }
  };

  makeupMenu = {
    eyes: {
      title: 'Maquillage - Yeux',
      items: [
        'Mascara',
        'Fard à paupières',
        'Eyeliner',
        'Crayon yeux & khôl',
        'Base paupière',
        'Feux-clis'
      ]
    },
    eyebrows: {
      title: 'Maquillage - Sourcils',
      items: [
        'Crayon & poudre sourcils',
        'Gel & Mascara Sourcils',
        'Kit Sourcils',
        'Bar à sourcils Benefit'
      ]
    },
    lips: {
      title: 'Maquillage - Lèvres',
      items: [
        'Rouge à lèvres',
        'Gloss',
        'Baume à lèvres',
        'Crayon à lèvres',
        'Base lèvres & Repulpeur'
      ]
    },
    face: {
      title: 'Maquillage - Teint',
      items: [
        'Fond de teint',
        'Anti-cerne et Correcteur',
        'Base de teint & Fixateur',
        'Poudre de soleil',
        'Poudre libre',
        'BB crème & CC crème',
        'Poudre matifiant',
        'Blush',
        'Highlighter',
        'Palette Teint',
        'Contouring'
      ]
    },
    accessories: {
      title: 'Autres',
      items: [
        'Ongles',
        'Pinceaux & éponges',
        'Démaquillant',
        'Accessoires maquillage'
      ]
    },
    inspiration: {
      title: 'Idées & inspirations beauté',
      items: [
        'Textures Tendances, Looks Intenses',
        'Préparer, fixer, sublimer',
        'Tendance sur les réseaux sociaux',
        'Souligner sa beauté',
        'Couleurs vibrantes',
        'Palettes atories',
        'Trouvez le fond de teint parfait'
      ]
    }
  };

  skincareMenu = {
    routines: {
      title: 'Routines',
      items: [
        'Coffret Soin Visage',
        'Routine soin visage',
        'Mini soin visage',
      ]
    },
    productTypes: {
      title: 'Type de soin',
      items: [
        'Sérum',
        'Crème de jour',
        'Crème de nuit',
        'Contour des yeux',
        'Soin des lèvres',
        'Gommage',
        'Soin des cils et sourcils',
        'Soin ciblé',
        'Huile visage',
        'BB crème & CC crème'
      ]
    },
    masks: {
      title: 'Masque visage',
      items: [
        'Masque tissu',
        'Masque crème'
      ]
    },
    needs: {
      title: 'Besoins',
      items: [
        'Soin anti-imperfections',
        'Soin anti-rides & anti-âge',
        'Soin hydratant & nourrissant',
        'Soin anti tache',
        'Soin pour les pores',
        'Soin anti-rougeurs',
        'Soin éclat & anti-fatigue',
        'Soin matifiant',
        'Soin peaux sensibles',
        'Soin raffermissant & liftant'
      ]
    },
    suncare: {
      title: 'Solaire',
      items: [
        'Après soleil visage',
        'Auto-bronzant visage',
        'Protection solaire visage'
      ]
    },
    cleansers: {
      title: 'Démaquillant & Nettoyant',
      items: [
        'Nettoyant Moussant Visage',
        'Lotion tonique',
        'Eau micellaire'
      ]
    },
    menSkincare: {
      title: 'Soin visage homme',
      items: [
        'Coffret Soin',
        'Soin Hydratant',
        'Nettoyant & Gommage',
        'Soin anti-cernes',
        'Soin anti âge'
      ]
    }
  };

  cartItemCount = 0;
  isSearchActive = false;

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
  }

  // Placeholder for future cart functionality
  updateCartCount(count: number) {
    this.cartItemCount = count;
  }
}
