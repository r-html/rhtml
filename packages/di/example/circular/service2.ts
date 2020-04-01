import { Inject, Injectable } from '../../src';
import { Service } from './service';

@Injectable()
export class Service2 {
  id = 1;
  @Inject(Service)
  public service: Service;
}
