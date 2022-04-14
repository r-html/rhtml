import { LitServiceElement } from '@rhtml/experiments';
import { Component } from '@rxdi/lit-html';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface IUser {
  id?: number;
  name?: string;
}

/**
 * @customElement user-service
 */
@Component({
  selector: 'user-service',
})
export class UserService extends LitServiceElement<UserService> {
  getUserById(id: number) {
    return of({ id, name: 'Kristyian Tachev' }).pipe(delay(2000)).toPromise();
  }
}
