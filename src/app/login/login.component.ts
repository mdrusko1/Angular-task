import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {User} from '../model/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  invalidLogin = false;
  loginForm: FormGroup;
  @ViewChild('username') inputUserName: ElementRef;
  @ViewChild('password') inputPassword: ElementRef;

  users: User[] = [];

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) {

    window.localStorage.removeItem('token');
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const user = this.loginForm.value;
    console.log(user);
    this.router.navigate(['/dashboard']);

    // this.authService.login(user.username, user.password).subscribe(data => {
    //  console.log('Response: ', data);
    // });
  }
}
