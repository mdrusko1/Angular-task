import {Injectable} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';
import {User} from './app/model/User';
import {Country} from './app/model/Country';


@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {

    const users = [
      new User(1, 'user1', 'Marko', 'Drušković', 'pass1', '123456789', 'Croatia'),
      new User(2, 'user2', 'Patrick', 'Stewart', 'pass2', '123456789', 'Solomon Islands'),
      new User(3, 'user3', 'Jonathan', 'Frakes', 'pass3', '123456789', 'Russian Federation'),
      new User(4, 'user4', 'LeVar', 'Burton', 'pass4', '123456789', 'Austria'),
      new User(5, 'user5', 'Denise', 'Crosby', 'pass5', '123456789', 'Kazakhstan'),
    ];

    const countries = [
      new Country(1, '385', 'Croatia'),
      new Country(2, '667', 'Solomon Islands'),
      new Country(3, '007', 'Russian Federation'),
      new Country(4, '43', 'Austria'),
      new Country(5, '996', 'Kazakhstan'),
    ];

    return {users, countries};

  }

  genId(users: User[]): number {
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 11;
  }
}