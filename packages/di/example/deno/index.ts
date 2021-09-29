import { Bootstrap, Inject, Injectable, Module } from '@rhtml/di';

@Injectable()
class MyService {
  OnInit() {
    console.log('Initialized');
  }
}
@Injectable()
class MyService2 {
  constructor(@Inject(MyService) private myService: MyService) {}
  OnInit() {
    console.log(this.myService);
    console.log('Initialized');
  }
}

@Module({
  providers: [MyService, MyService2]
})
export class AppModule {}

await Bootstrap(AppModule);
