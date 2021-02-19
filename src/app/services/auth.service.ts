import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  SERVER_URL = 'http://localhost:8080/api/';

  constructor(private httpClient: HttpClient) {
  }

  login(username: string, password: string) {
    return this.httpClient.post(this.SERVER_URL + 'login', {
      credentials: {
        username: username,
        password: password
      }
    });
  }

  public getUsers() {
    return this.httpClient.get(this.SERVER_URL + 'users');
  }

  public getCountries() {
    return this.httpClient.get(this.SERVER_URL + 'countries');
  }


  public getPolicy(policyId) {
    return this.httpClient.get(`${this.SERVER_URL + 'policies'}/${policyId}`);
  }

  public createPolicy(policy: { id: number, amount: number, clientId: number, userId: number, description: string }) {
    return this.httpClient.post(`${this.SERVER_URL + 'policies'}`, policy);
  }

  public deletePolicy(policyId) {
    return this.httpClient.delete(`${this.SERVER_URL + 'policies'}/${policyId}`);
  }

  public updatePolicy(policy: { id: number, amount: number, clientId: number, userId: number, description: string }) {
    return this.httpClient.put(`${this.SERVER_URL + 'policies'}/${policy.id}`, policy);
  }
}
