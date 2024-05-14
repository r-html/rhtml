import { Controller, Route } from '@rhtml/fastify'

@Controller({
  route: '/<%= decamelize(name) %>',
})
export class <%= classify(name) %>Controller {

    @Route({
      method: 'GET',
    })
    get<%= classify(name) %>() {
      return {
        hello: 'world'
      }
    }
}
