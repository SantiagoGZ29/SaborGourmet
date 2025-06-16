import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    
    const sesionActiva = localStorage.getItem('usuarioActivo') === 'true';

    if (!sesionActiva) {
      this.router.navigate(['/login']); // Redirige al login si no hay sesión activa
      return false;
    }

    return true; // Permite el acceso
  }
}

