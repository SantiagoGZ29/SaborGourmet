import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})


export class LoginPage {

  usuario: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
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
  Login() {
    //Verificar campo vacío
    if (!this.usuario){
      this.mostrarAlerta('El campo Usuario es obligatorio');
      return;
    }
    //Validar formato de email
    if (!this.validarEmail(this.usuario)) {
      this.mostrarAlerta('El usuario debe tener entre 3 y 8 caracteres alfanuméricos');
      return;
    }
    //Verificar contraseña vacía
    if (!this.password) {
      this.mostrarAlerta('El campo contraseña es obligatorio');
      return;
    }
    //Validar formato de contraseña
    if (!this.validarPassword(this.password)) {
      this.mostrarAlerta('La contraseña debe tener 4 dígitos numéricos');
      return;
    }

    //Si todo es correcto, redirigir a la página de inicio
    this.router.navigate(['/home'], { state: { usuario: this.usuario } });
  }
}

