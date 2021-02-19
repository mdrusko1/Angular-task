import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Country} from '../model/Country';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  API_COUNTRIES = 'api/countries';

  constructor(private http: HttpClient) {
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.API_COUNTRIES).pipe(
      tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }

  handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}
