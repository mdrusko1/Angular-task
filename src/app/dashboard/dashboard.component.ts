import {Component, OnInit} from '@angular/core';
import {User} from '../model/User';
import {UserService} from '../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Country} from '../model/Country';
import {CountryService} from '../services/country.service';
import {OibValidator} from 'angular-oib-validator';
import {ToastrService} from 'ngx-toastr';
import {handleError, hideSpinnerAndDisplayError} from '../util/error-handler';
import {SpinnerUtil} from '../util/spinner-utilities';
import Swal from 'sweetalert2';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  countries: Country[];
  selectedUser: User;
  userForm: FormGroup;

  users$: Observable<Array<User>>;
  refreshUsers$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

  private getUsers() {
    this.users$ = this.refreshUsers$.pipe(switchMap(_ => this.userService.getUsers().pipe(
      map(data => {
        return data;
      }), catchError(handleError))));
  }

  private getCountries() {
    this.countryService.getCountries().subscribe(data => {
      this.countries = data;
    }, handleError);
  }

  private onDelete() {
    SpinnerUtil.showSpinner();
    this.userService.deleteUser(this.selectedUser.id).subscribe(() => {
      this.showSuccessToast('User deleted!');
      this.userForm.reset();
      this.refreshUsers$.next(true);
      SpinnerUtil.hideSpinner();
    }, err => {
      hideSpinnerAndDisplayError(err);
    });
  }

  private getCountryById(id: string) {
    const country = this.countries.find(i => i.country_code === id);
    if (typeof country === 'undefined') {
      return null;
    }
    return country;
  }

  private checkIfOibExist(oib: string): boolean {
    const exist = this.users$.pipe(map(data => {
      data.find(x => x.oib === oib);
      return !!exist;
    }));
    return false;
  }

  private showSuccessToast(msg: string) {
    this.toast.success(msg, 'Success', {
      timeOut: 2000
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getCountries();
  }

  onUserEdit(user: User) {
    this.selectedUser = user;
    this.userForm.controls['id'].setValue(user.id);
    this.userForm.controls['username'].setValue(user.username);
    this.userForm.controls['firstname'].setValue(user.firstname);
    this.userForm.controls['lastname'].setValue(user.lastname);
    this.userForm.controls['password'].setValue(user.password);
    this.userForm.controls['oib'].setValue(user.oib);
    this.userForm.controls['country'].setValue(this.getCountryById(user.country).country_code);
  }

  onSave() {
    const user = this.userForm.value;
    SpinnerUtil.showSpinner();

    if (user.id == null) {
      if (this.checkIfOibExist(user.oib)) {
        this.showOibExistDialog();
        SpinnerUtil.hideSpinner();
        return;
      }
      // Save New User
      this.userService.addUser(user).subscribe(() => {
        this.showSuccessToast(`User ${user.firstname + ' ' + user.lastname + ' saved!'}`);
      }, err => hideSpinnerAndDisplayError(err));
    } else {
      // Update Existing User
      this.userService.updateUser(user).subscribe(() => {
        this.showSuccessToast(`User ${user.firstname + ' ' + user.lastname + ' updated!'}`);
      }, err => hideSpinnerAndDisplayError(err));
    }
    SpinnerUtil.hideSpinner();
    this.userForm.reset();
    this.refreshUsers$.next(true);
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

  showOibExistDialog() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'User with this OIB already exist!',
    }).then(d => d.dismiss);
  }
}
