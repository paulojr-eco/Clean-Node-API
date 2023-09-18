import { forbidden, successful } from '@/presentation/helpers/http/http-helper';
import { type LoadSurveyById, type Controller, type HttpRequest, type HttpResponse } from './load-survey-result-controller-protocols';
import { InvalidParamError } from '@/presentation/errors';

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params;
    const survey = await this.loadSurveyById.loadById(surveyId);
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }
    return successful({});
  }
}
