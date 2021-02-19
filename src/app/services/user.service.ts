import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/User';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_USERS = 'api/users';

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_USERS).pipe(
      tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }

  handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}
