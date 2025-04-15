import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = environment.apiUrl + '/test.php';
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  getApiData(): Observable<any> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
