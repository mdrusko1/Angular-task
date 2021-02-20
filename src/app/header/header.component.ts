import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {User} from '../model/User';
import {EMPTY, Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<User>;

  constructor(public authService: AuthService) {
    this.user$ = this.authService.getUser.pipe(tap(res => {
      console.log(res);
      return res;
    }), catchError(err => {
      console.log('Error: ', err);
      return EMPTY;
    }));
  }

  ngOnInit(): void { }

  onLogout() {
    this.authService.logout();
  }
}
