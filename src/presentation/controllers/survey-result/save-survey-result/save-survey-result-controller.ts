import { forbidden, successful } from '@/presentation/helpers/http/http-helper';
import {
  type LoadSurveyById,
  type Controller,
  type HttpRequest,
  type HttpResponse
} from './save-survey-result-controller-protocols';
import { InvalidParamError } from '@/presentation/errors';

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { params } = httpRequest;
    const survey = await this.loadSurveyById.loadById(params.surveyId);
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }
    return successful({});
  }
}
