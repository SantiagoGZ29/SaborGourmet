import { Component, OnInit } from '@angular/core';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.page.html',
  styleUrls: ['./ubicacion.page.scss'],
  standalone: false
})
export class UbicacionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  async obtenerUbicacion() {
    try {
      // Permission 
      const permission: PermissionStatus = await Geolocation.checkPermissions();

      if (permission.location !== 'granted') {
        
        const requestPermission = await Geolocation.requestPermissions();
        if (requestPermission.location !== 'granted') {
          alert('Permiso de ubicación denegado');
          return;
        }
      }

      // Get current position
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });

      // Constantes de cordenadas
      const latitud = position.coords.latitude;
      const longitud = position.coords.longitude;

      const mapFrame: HTMLIFrameElement | null = document.getElementById('mapFrame') as HTMLIFrameElement;

      if (mapFrame) {
        // Set the src attribute to load the Google Maps with the coordinates
        mapFrame.src = `https://www.google.com/maps?q=${latitud},${longitud}&output=embed`;
      }

    } catch (error) {
      alert('Error al obtener la ubicación. Asegúrate de que los servicios de ubicación estén habilitados.');
    }
}
}