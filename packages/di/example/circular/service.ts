import { Inject, Injectable } from '../../src';
import { Service2 } from './service2';

@Injectable()
export class Service {
  @Inject(Service2)
  public service: Service2;
}
