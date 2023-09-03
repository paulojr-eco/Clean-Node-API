import { successful } from '../../../../presentation/helpers/http/http-helper';
import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type Validation
} from './add-survey-controller-protocols';

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body);
    return await new Promise((resolve) => {
      resolve(successful(''));
    });
  }
}
