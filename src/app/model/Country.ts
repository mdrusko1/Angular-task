export class Country {
  id: number;
  country_code: string;
  country_name: string;


  constructor(id: number, country_code: string, country_name: string) {
    this.id = id;
    this.country_code = country_code;
    this.country_name = country_name;
  }
}
