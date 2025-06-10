import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-cadeaux',
  imports: [HeaderComponent],
  standalone: true,
  templateUrl: './cadeaux.component.html',
  styleUrl: './cadeaux.component.scss'
})
export class CadeauxComponent {

}
