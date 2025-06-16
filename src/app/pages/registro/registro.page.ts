import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'; 
import { DbserviceService } from 'src/app/services/dbservice.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {

  // Declaración de variables
  usuario: string = '';
  password: string = '';
  active: number = 0;

  nombre: string = '';
  apellido: string = '';
  fechaNacimiento: string = '';
  email: string = '';
  telefono: string = '';
  direccion: string = '';
  genero: string = '';

  registroStatus: string = '';

  constructor(private alertController: AlertController, private dbserviceService: DbserviceService, private router : Router ) { }

  ngOnInit() {}

  // Alert controller para mostrar mensajes
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Método para guardar el usuario
  async guardarUsuario() {
    if (
      this.usuario.trim() === '' || this.password.trim() === '' || this.nombre.trim() === '' ||
      this.apellido.trim() === '' || this.fechaNacimiento.trim() === '' || this.email.trim() === '' ||
      this.telefono.trim() === '' || this.direccion.trim() === '' || this.genero.trim() === ''
    ) {
      this.presentAlert('Error', 'Por favor, complete todos los campos.');
    } else {
      await this.insertUsuario();
    }
  }

  // Método para registrar el usuario en la base de datos
  async insertUsuario() {
    const usuarioObj = {
      usuario: this.usuario,
      password: this.password,
      active: 0, // Por defecto, el usuario no está activo
      nombre: this.nombre,
      apellido: this.apellido,
      genero: this.genero,
      telefono: this.telefono,
      email: this.email,
      direccion: this.direccion,
      fechaNacimiento: this.fechaNacimiento
    };
    const success = await this.dbserviceService.insertUsuario(usuarioObj);
    this.registroStatus = success ? 'Registro exitoso' : 'Error al registrar';
    this.presentAlert('Registro', this.registroStatus);
    if (success) {
      this.router.navigate(['/login']); // Redirigir al login si el registro es exitoso
    }
  }
}