import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {User} from '../model/User';
import {SpinnerUtil} from '../util/spinner-utilities';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  @ViewChild('username') inputUserName: ElementRef;
  @ViewChild('password') inputPassword: ElementRef;
  loginForm: FormGroup;
  invalidLogin;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router) {

    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.getUser.subscribe(res => {
      this.invalidLogin = res === undefined ? this.invalidLogin = true : this.invalidLogin = false;
    }, catchError(err => {
      return this.handleError(err);
    }));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    SpinnerUtil.showSpinner();
    const user = this.loginForm.value;
    this.authService.login(user.username, user.password).subscribe((data: User) => {
        console.log(data);
        SpinnerUtil.hideSpinner();
        this.verifyCredentials(user.username, user.password);
      }
    );
  }

  verifyCredentials(userName: string, password: string) {
    this.userService.getUsers().subscribe((users: User[]) => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.username === userName && user.password === password) {
          this.authService.saveUserSession(user.username);
          this.invalidLogin = false;
          this.router.navigate(['/dashboard']);
        }
      }
      this.invalidLogin = true;
    });
  }

  handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}
