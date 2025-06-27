import { Component, OnInit } from '@angular/core';
import { ApiMenuService } from 'src/app/services/api-menu.service';
import { AlertController } from '@ionic/angular'; 

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: false
})
export class CategoriasPage implements OnInit {
// Declaración de variables
  categorias: any[] = [];
  nuevoMenu: any = {strCategory:'',strCategoryDescription:''}; //Datos del nuevo menu

  constructor(
    private apiMenuService: ApiMenuService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    // Llama al metodo getMenu
    this.apiMenuService.getMenu().subscribe(
      (data) => {
        // Asigna la respuesta a la variable categorias
        this.categorias = data.categories;
      },
      (error) => {
        this.mostrarAlert(error?.message || JSON.stringify(error) || 'Error desconocido');
      }
    );
  }



  // Mostrar alerta
  async mostrarAlert(mensaje:any) {
    const alert = await this.alertController.create({
      header: 'Mi app',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }


}
