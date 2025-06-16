import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbserviceService } from 'src/app/services/dbservice.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {
  
  //Variables mis datos
  usuario: any = {};
  nombre: string = '';
  apellido: string = '';
  fechaNacimiento: string = '';
  email: string = '';
  telefono: string = '';
  direccion: string = '';
  genero: string = '';

  //Variables Experiencia Laboral
  empresa: string = '';
  anioInicio: number = 0;
  estado: string = '';
  anioFin: number = 0;
  cargo: string = '';

  //Variables certificaciones
  nombreCertificado: string = '';
  fechaCertificacion: string = '';
  vencimientoCertificacion: string = '';
  fechaVencimiento: string = '';


  constructor(private router: Router, private alertController : AlertController, private dbserviceService:DbserviceService ) { }

  // Método para mostrar alerta de error
  async mostrarAlerta(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { usuario: string };
    this.usuario = state?.usuario || '';

    if (history.state && history.state.usuario) {
    this.usuario = history.state.usuario;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    this.router.navigate(['/login']);
  }

  //Actualizar datos del usuario
  async actualizarDatos() {
    // Validar campos de los inputs
    if (
      this.nombre.trim() === '' ||
      this.apellido.trim() === '' ||
      this.fechaNacimiento.trim() === '' ||
      this.email.trim() === '' ||
      this.telefono.trim() === '' ||
      this.direccion.trim() === '' ||
      this.genero.trim() === ''
    ) {
      this.mostrarAlerta('Por favor, complete todos los campos.');
    } else {
      await this.updateUsuario();
    }
  }

  // Método para actualizar los datos del usuario
  async updateUsuario() {
    const usuarioData = {
      usuario: this.usuario.usuario,
      nombre: this.nombre,
      apellido: this.apellido,
      fechaNacimiento: this.fechaNacimiento,
      email: this.email,
      telefono: this.telefono,
      direccion: this.direccion,
      genero: this.genero
    };

    const result = await this.dbserviceService.updateUsuario(usuarioData);
    if (result) {
      this.mostrarAlerta('Datos actualizados correctamente');
    } else {
      this.mostrarAlerta('Error al actualizar los datos');
    }
  }
     
}
