export class SignUpController {
  handle (httpReqeust: any): any {
    return {
      statusCode: 400,
      body: new Error('Missing parameter: name')
    };
  }
}
