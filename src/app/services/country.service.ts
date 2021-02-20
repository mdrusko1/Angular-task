import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Country} from '../model/Country';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.authService.SERVER_URL + '/api/countries'}`).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}
