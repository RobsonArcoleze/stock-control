import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environments.prod';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) { }

  getAllProducts(): Observable<GetAllProductsResponse[]>{
    return this.http.get<GetAllProductsResponse[]>(
      `${this.API_URL}/products`, this.httpOptions
    )
    .pipe(
      map((products) => products.filter(data => data?.amount > 0))
    )
  }
}
