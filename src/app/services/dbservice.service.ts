import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DbserviceService {

  public db!: SQLiteObject;
  private IsDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private toastController: ToastController) {
    this.initDatabase();
  }

  private async initDatabase() {
    try {
      const db = await this.sqlite.create({
        name: 'mydatabase.db',
        location: 'default'
      });
      this.db = db;
      // Habilitar claves foráneas
      await this.db.executeSql('PRAGMA foreign_keys = ON;', []);
      this.createTables();
      this.IsDBReady.next(true);
      this.presentToast('Éxito','Base de datos y tablas creadas');
    } catch (error) {
      console.error(error);
    }
  }

  private createTables() {

    // Tabla de usuario
    this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        active INTEGER NOT NULL DEFAULT 0,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        genero TEXT NOT NULL,
        telefono TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        direccion TEXT NOT NULL,
        fechaNacimiento TEXT NOT NULL
      )`, [])
      .then(() => this.presentToast('Éxito','Tabla usuario creada'))
      .catch(() => this.presentToast('Error','Error al crear la tabla usuario'));

    // Tabla de experiencia laboral
    this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS experiencia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        empresa TEXT NOT NULL,
        anioInicio TEXT NOT NULL,
        estado TEXT NOT NULL,
        anioFin TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
      )`, [])
      .then(() => this.presentToast('Éxito','Tabla experiencia creada'))
      .catch(() => this.presentToast('Error','Error al crear la tabla experiencia'));

    // Tabla de certificación
    this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS certificacion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        nombreCertificado TEXT NOT NULL,
        fechaCertificacion TEXT NOT NULL,
        vencimientoCertificacion TEXT NOT NULL,
        fechaVencimiento TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
      )`, [])
      .then(() => this.presentToast('Éxito','Tabla certificación creada'))
      .catch(() => this.presentToast('Error','Error al crear la tabla certificación'));
  }

  // Validar usuario
  public async validarUsuario(usuario: string, password: string): Promise<boolean> {
    try {
      const sql = 'SELECT * FROM usuario WHERE usuario = ? AND password = ?';
      const result = await this.db.executeSql(sql, [usuario, password]);
      return result.rows.length > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

// Insertar usuario
public async insertUsuario(usuario: any): Promise<boolean> {

  try {
    const sql = 'INSERT INTO usuario (usuario, password, active, nombre, apellido, genero, telefono, email, direccion, fechaNacimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [usuario.usuario, usuario.password, usuario.active, usuario.nombre, usuario.apellido, usuario.genero, usuario.telefono, usuario.email, usuario.direccion, usuario.fechaNacimiento];
    await this.db.executeSql(sql, values);
    this.presentToast('Éxito','Usuario insertado correctamente');
    return true;
  } catch (error) {
    console.error(error);
    this.presentToast('Error','Error al insertar el usuario');
    return false;
  }
}

// Actualizar usuario
public async updateUsuario(usuario: any): Promise<boolean> {
  try {
    const sql = 'UPDATE usuario SET nombre = ?, apellido = ?, genero = ?, telefono = ?, email = ?, direccion = ?, fechaNacimiento = ? WHERE usuario = ?';
    const values = [usuario.nombre, usuario.apellido, usuario.genero, usuario.telefono, usuario.email, usuario.direccion, usuario.fechaNacimiento, usuario.usuario];
    await this.db.executeSql(sql, values);
    this.presentToast('Éxito','Usuario actualizado correctamente');
    return true;
  } catch (error) {
    console.error(error);
    this.presentToast('Error','Error al actualizar el usuario');
    return false;
  }
}
  // Validar la existencia de un usuario por id
  public async validarUsuarioPorId(id: number): Promise<boolean> {
    try {
      const sql = 'SELECT * FROM usuario WHERE id = ?';
      const result = await this.db.executeSql(sql, [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // Insertar experiencia laboral
  public async insertExperiencia(experiencia: any): Promise<boolean> {

    // Validar que el usuario exista antes de insertar la experiencia
    const usuarioExiste = await this.validarUsuarioPorId(experiencia.usuario_id);
    if (!usuarioExiste) {
      this.presentToast('Error','El usuario no existe');
      return false;
    }
    

    try {
      const sql = 'INSERT INTO experiencia (usuario_id, empresa, anioInicio, estado, anioFin) VALUES (?, ?, ?, ?, ?)';
      const values = [experiencia.usuario_id, experiencia.empresa, experiencia.anioInicio, experiencia.estado, experiencia.anioFin];
      await this.db.executeSql(sql, values);
      this.presentToast('Éxito','Experiencia laboral insertada correctamente');
      return true;
    } catch (error) {
      console.error(error);
      this.presentToast('Error','Error al insertar la experiencia laboral');
      return false;
    }
  }
  // Insertar certificación
  public async insertCertificacion(certificacion: any): Promise<boolean>{

    // Validar que el usuario exista antes de insertar la certificación
    const usuarioExiste = await this.validarUsuarioPorId(certificacion.usuario_id);
    if (!usuarioExiste) {
      this.presentToast('Error','El usuario no existe');
      return false;
    }
    

    try {
      const sql = 'INSERT INTO certificacion (usuario_id, nombreCertificado, fechaCertificacion, vencimientoCertificacion, fechaVencimiento) VALUES (?, ?, ?, ?, ?)';
      const values = [certificacion.usuario_id, certificacion.nombreCertificado, certificacion.fechaCertificacion, certificacion.vencimientoCertificacion, certificacion.fechaVencimiento];
      await this.db.executeSql(sql, values);
      this.presentToast('Éxito','Certificación insertada correctamente');
      return true;
    } catch (error) {
      console.error(error);
      this.presentToast('Error','Error al insertar la certificación');
      return false;
    }
  }

  // Pasar los datos del usuario a la página de perfil
  public async getUsuario(usuario: string): Promise<any> {
    try {
      const sql = 'SELECT * FROM usuario WHERE usuario = ?';
      const result = await this.db.executeSql(sql, [usuario]);
      if (result.rows.length > 0) {
        return result.rows.item(0);
      } else {
        this.presentToast('Error','Usuario no encontrado');
        return null;
      }
    } catch (error) {
      console.error(error);
      this.presentToast('Error','Error al obtener el usuario');
      return null;
    }
  }

  private async presentToast( header: string, message: string) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  // indicar si la base de datos está lista
  public isDBReady() {
    return this.IsDBReady.asObservable();
  }
}
