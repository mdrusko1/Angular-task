import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {User} from '../model/User';

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

  users: User[] = [];

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder) {

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
    const user = this.loginForm.value;
    this.authService.login(user.username, user.password);
  }

  handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}
