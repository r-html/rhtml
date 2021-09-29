import '@reflect/metadata';

import { Bootstrap, Injectable, Module } from '@rhtml/di';

@Injectable()
class MyService {
  OnInit() {
    console.log('[MyService]: initialized');
  }

  helloWorld() {
    return 'Hello World from @rhtml/di';
  }
}

@Injectable()
class MyService2 {
  constructor(private myService: MyService) {}
  OnInit() {
    console.log(this.myService.helloWorld());
  }
}

@Module({
  providers: [MyService, MyService2]
})
export class AppModule {}

await Bootstrap(AppModule);
