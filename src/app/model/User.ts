export class User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  oib: string;
  country: string;

  constructor(id: number, username: string, firstName: string, lastName: string, password: string, oib: string, country: string) {
    this.id = id;
    this.username = username;
    this.firstname = firstName;
    this.lastname = lastName;
    this.password = password;
    this.oib = oib;
    this.country = country;
  }
}
