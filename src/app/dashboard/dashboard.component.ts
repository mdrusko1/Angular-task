import {Component, OnInit} from '@angular/core';
import {User} from '../model/User';
import {UserService} from '../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {throwError} from 'rxjs';
import {Country} from '../model/Country';
import {CountryService} from '../services/country.service';
import {OibValidator} from 'angular-oib-validator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  userForm: FormGroup;
  selectedCountry: Country;
  countries: Country[];
  users: User[];
  selectedUser: User;

  constructor(private userService: UserService,
              private countryService: CountryService,
              private formBuilder: FormBuilder) {
    this.userForm = formBuilder.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      password: ['', Validators.required],
      oib: ['', [OibValidator.check]],
      country: ['', Validators.required],
    });
    this.userForm.reset();
  }

  ngOnInit(): void {
    this.getUsers();
    this.getCountries();
  }

  getUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      return data;
    }, this.handleError);
  }

  private getCountries() {
    this.countryService.getCountries().subscribe(data => {
      this.countries = data;
    }, this.handleError);
  }

  onUserEdit(user: User) {
    this.selectedUser = user;
    this.userForm.controls['username'].setValue(user.username);
    this.userForm.controls['firstname'].setValue(user.firstname);
    this.userForm.controls['lastname'].setValue(user.lastname);
    this.userForm.controls['password'].setValue(user.password);
    this.userForm.controls['oib'].setValue(user.oib);
    this.userForm.controls['country'].setValue(this.findCountryByName(user.country));
  }

  onSave() {
    const user = this.userForm.value;
    this.userService.addUser(user).subscribe(res => {
      console.log(res);
      this.getUsers();
    });
  }

  onDelete() {
    this.userService.deleteUser(this.selectedUser.id).subscribe(res => {
      console.log(res);
      this.getUsers();
    });
  }

  onSelectedCountry(selectedCountry: Country) {
    console.log(selectedCountry);
    // this.userForm.controls['country'].setValue(this.findCountryByName(selectedCountry.country_name));
    // console.log(this.findCountryById(selectedCountry.id).country_code);
  }

  findCountryByName(name: string) {
    const country = this.countries.find(i => i.country_name === name);
    if (typeof country === 'undefined') {
      return null;
    }
    return country;
  }

  handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}
