import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbserviceService } from 'src/app/services/dbservice.service';
import { AlertController } from '@ionic/angular';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  //Variables para la imagen del perfil
  captureImage: string | undefined;
  
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
  usuario_id: number = 0; 
  empresa: string = '';
  anioInicio: string = '';
  estado: string = '';
  anioFin: string = '';
  cargo: string = '';

  //Variables certificaciones
  nombreCertificado: string = '';
  fechaCertificacion: string = '';
  vencimientoCertificacion: string = '';
  fechaVencimiento: string = '';


  constructor(private router: Router, private alertController : AlertController, private dbserviceService:DbserviceService ) { }

  // Método para mostrar alerta de error
  async mostrarAlerta(header:  string, message: string) {
    const alert = await this.alertController.create({
      header: header,
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
      this.mostrarAlerta('Error','Por favor, complete todos los campos.');
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
      this.mostrarAlerta('Éxito','Datos actualizados correctamente');
    } else {
      this.mostrarAlerta('Error','Error al actualizar los datos');
    }
  }

  // Método para insertar datos de experiencia laboral
  async insertarExperiencia() {
    // Validar campos de los inputs
    if (
      this.empresa.trim() === '' ||
      this.anioInicio === ''||
      this.estado.trim() === '' 
    ) {
      this.mostrarAlerta('Error','Por favor, complete todos los campos.');
    } else {
      await this.insertExperiencia();
    }
  }

  // Método para insertar experiencia laboral
  async insertExperiencia() {
    const experienciaData = {
      usuario_id: this.usuario.id, 
      empresa: this.empresa,
      anioInicio: this.anioInicio,
      estado: this.estado,
      anioFin: this.anioFin,
    };

    const result = await this.dbserviceService.insertExperiencia(experienciaData);
    if (result) {
      this.mostrarAlerta('Éxito','Experiencia laboral insertada correctamente');
    } else {
      this.mostrarAlerta('Error','Error al insertar la experiencia laboral');
    }
  }


  // Método para insertar datos de certificación
  async insertarCertificacion() {
    // Validar campos de los inputs
    if (
      this.nombreCertificado.trim() === '' ||
      this.fechaCertificacion.trim() === '' ||
      this.vencimientoCertificacion.trim() === '' 
    ) {
      this.mostrarAlerta('Error','Por favor, complete todos los campos.');
    } else {
      await this.insertCertificacion();
    }
  }
  // Método para insertar certificación
  async insertCertificacion() {
    const certificacionData = {
      usuario_id: this.usuario.id,
      nombreCertificado: this.nombreCertificado,
      fechaCertificacion: this.fechaCertificacion,
      vencimientoCertificacion: this.vencimientoCertificacion,
      fechaVencimiento: this.fechaVencimiento
    };

    const result = await this.dbserviceService.insertCertificacion(certificacionData);
    if (result) {
      this.mostrarAlerta('Éxito','Certificación insertada correctamente');
    } else {
      this.mostrarAlerta('Error','Error al insertar la certificación');
    }
  }
     

  // Método para capturar imagen del perfil
  async capturarImagen() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });

      this.captureImage = image.dataUrl;
    } catch (error) {
      this.mostrarAlerta('Error', 'No se pudo capturar la imagen.');
    }
  }





}
