import { Bootstrap, get, Module } from '@rhtml/di'
import { FastifyModule } from '@rhtml/fastify'
import fastify from 'fastify'

import { <%= classify(name) %>Controller } from './<%= name %>.controller';

describe('<%= classify(name) %> Controller', () => {
  let <%= decamelize(name) %>Controller: <%= classify(name) %>Controller

  beforeAll(async () => {
    @Module({
      imports: [
        FastifyModule.forRoot(fastify, {
          logger: true,
        }),
      ],
      bootstrap: [<%= classify(name) %>Controller],
    })
    class AppModule {}

    await Bootstrap(AppModule)
    <%= decamelize(name) %>Controller = get(<%= classify(name) %>Controller)

  });

  it('e2e: get => (<%= classify(name) %>) : Should sucessfully return expected result', async () => {
    const response = {
        hello: 'world',
      }
      const result = await <%= decamelize(name) %>Controller.get<%= classify(name) %>()
      expect(result).toEqual(response)
  });
});
