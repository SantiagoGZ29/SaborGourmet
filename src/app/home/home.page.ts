import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  // Definición de las variables
  usuario: string = '';
  password: string = '';

  constructor(
    private router: Router,
  ) {}

    ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { usuario: string };
    this.usuario = state?.usuario || '';

    
  }

  irAMenu() {
    this.router.navigate(['/menu']);
  }

  irABebidas() {
    this.router.navigate(['/bebidas']);
  }

  irACategorias() {
    this.router.navigate(['/categorias']);
  }


}
