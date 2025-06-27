import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiMenuService {

  private apiUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';

  constructor(private http: HttpClient) { }

  // Método GET para obtener los Menu
  getMenu(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

}
