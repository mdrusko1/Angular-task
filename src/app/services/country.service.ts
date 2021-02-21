import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Country} from '../model/Country';
import {AuthService} from './auth.service';
import {handleError} from '../util/error-handler';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.authService.SERVER_URL + '/api/countries'}`).pipe(
      catchError(handleError)
    );
  }
}
