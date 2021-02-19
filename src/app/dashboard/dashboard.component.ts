import {Component, OnInit} from '@angular/core';
import {User} from '../model/User';
import {UserService} from '../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {throwError} from 'rxjs';
import {Country} from '../model/Country';
import {CountryService} from '../services/country.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  countries: Country[] = [];
  selectedCountry: any;

  constructor(private userService: UserService,
              private countryService: CountryService,
              private formBuilder: FormBuilder) {
    this.userForm = formBuilder.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      password: ['', Validators.required],
      oib: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getCountries();
  }

  getUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    }, this.handleError);
  }

  private getCountries() {
    this.countryService.getCountries().subscribe(data => {
      console.log(data);
      this.countries = data;
    }, this.handleError);
  }

  onUserClick(user: User) {
    console.log(user);
  }

  onSave() {

  }

  onDelete() {

  }

  onSelectedCountry(selectedCountry: Event) {
    console.log(selectedCountry);
  }

  handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}
