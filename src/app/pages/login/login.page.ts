import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbserviceService } from 'src/app/services/dbservice.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})


export class LoginPage {

  // Declaracion de variables
  usuario: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private dbserviceService: DbserviceService
  ) { }

  //Metodo para mostrar alerta de error
  async mostrarAlerta(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  //Funcion para validar el email
  validarEmail(usuario: string): boolean {
    const re = /^[a-zA-Z0-9]{3,8}$/;
    return re.test(usuario);
  }
  //Funcion para validar el metodo password
  validarPassword(password: string): boolean {
    const re = /^\d{4}$/;
    return re.test(password);
}


  //Metodo para iniciar sesion
  async login(){
    if (
      this.usuario.trim() === '' || this.password.trim() === ''
    ) {
      this.mostrarAlerta('Por favor, complete todos los campos.');
    } else {
      await this.validarUsuario();
    }
  }

// Método para validar el usuario
  async validarUsuario() {
    try {
      const usuarioValido = await this.dbserviceService.validarUsuario(this.usuario, this.password);
      if (usuarioValido) {
        localStorage.setItem('usuarioActivo', 'true');
        // Obtener los datos del usuario y navegar pasando los datos
        const usuarioData = await this.dbserviceService.getUsuario(this.usuario);
        
        if (usuarioData) {
          this.router.navigate(['/perfil'], { state: { usuario: usuarioData } });
        } else {
          await this.mostrarAlerta('No se encontraron datos para el usuario.');
        }
      } else {
        await this.mostrarAlerta('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error al validar el usuario:', error);
      await this.mostrarAlerta('Error al validar el usuario. Por favor, inténtelo de nuevo más tarde.');
    }
  }
}

