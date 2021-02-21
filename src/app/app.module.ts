import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from '../in-memory-data.service';
import {HeaderComponent} from './header/header.component';
import {SpinnerComponent} from './util/spinner.component';
import {AuthGuard} from './guard/auth.guard';
import {AngularOibValidatorModule} from 'angular-oib-validator';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {dataEncapsulation: false}
    ),
    ToastrModule.forRoot(),
    AngularOibValidatorModule.forRoot(),
    RouterModule.forRoot([
      {path: 'login', component: LoginComponent},
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
      {path: '', component: AppComponent},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
