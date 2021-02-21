import {Component, OnInit} from '@angular/core';
import {User} from '../model/User';
import {UserService} from '../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {throwError} from 'rxjs';
import {Country} from '../model/Country';
import {CountryService} from '../services/country.service';
import {OibValidator} from 'angular-oib-validator';
import {ToastrService} from 'ngx-toastr';
import {hideSpinnerAndDisplayError} from '../util/error-handler';
import {SpinnerUtil} from '../util/spinner-utilities';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  countries: Country[];
  selectedUser: User;
  users: User[];
  userForm: FormGroup;

  constructor(private userService: UserService,
              private countryService: CountryService,
              private formBuilder: FormBuilder,
              private toast: ToastrService) {
    this.userForm = formBuilder.group({
      id: [''],
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
    this.userForm.controls['id'].setValue(user.id);
    this.userForm.controls['username'].setValue(user.username);
    this.userForm.controls['firstname'].setValue(user.firstname);
    this.userForm.controls['lastname'].setValue(user.lastname);
    this.userForm.controls['password'].setValue(user.password);
    this.userForm.controls['oib'].setValue(user.oib);
    this.userForm.controls['country'].setValue(this.getCountryByName(user.country).country_name);
  }

  onSave() {
    SpinnerUtil.showSpinner();
    const user = this.userForm.value;

    if (user.id == null) {
      this.userService.addUser(user).subscribe(() => {
        this.showSuccessToast(`User ${user.firstname + ' ' + user.lastname + ' saved!'}`);
      }, err => hideSpinnerAndDisplayError(err));
    } else {
      this.userService.updateUser(user).subscribe(() => {
        this.showSuccessToast(`User ${user.firstname + ' ' + user.lastname + ' updated!'}`);
      }, err => hideSpinnerAndDisplayError(err));
    }
    SpinnerUtil.hideSpinner();
    this.userForm.reset();
    this.getUsers();
  }

  onDelete() {
    SpinnerUtil.showSpinner();
    this.userService.deleteUser(this.selectedUser.id).subscribe(() => {
      this.showSuccessToast('User deleted!');
      this.userForm.reset();
      this.getUsers();
      SpinnerUtil.hideSpinner();
    }, err => {
      hideSpinnerAndDisplayError(err);
    });
  }

  getCountryByName(name: string) {
    const country = this.countries.find(i => i.country_name === name);
    if (typeof country === 'undefined') {
      return null;
    }
    return country;
  }

  showSuccessToast(msg: string) {
    this.toast.success(msg, 'Success', {
      timeOut: 2000
    });
  }

  showDeleteDialog() {
    Swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.onDelete();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    });
  }

  handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}

