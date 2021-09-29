import 'https://deno.land/x/reflect_metadata@v0.1.12/mod.ts';

import {
  Bootstrap,
  Injectable,
  Module
} from 'https://cdn.esm.sh/v53/@rhtml/di@0.0.81';

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
