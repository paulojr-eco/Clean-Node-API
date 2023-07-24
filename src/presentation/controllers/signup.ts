import { type HttpRequest, type HttpResponse } from 'presentation/protocols/http';

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing parameter: name')
      };
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing parameter: email')
      };
    }
    return {
      statusCode: 200,
      body: 'Successful'
    };
  }
}
