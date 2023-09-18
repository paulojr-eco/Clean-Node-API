import { successful } from '@/presentation/helpers/http/http-helper';
import { type LoadSurveyById, type Controller, type HttpRequest, type HttpResponse } from './load-survey-result-controller-protocols';

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params;
    await this.loadSurveyById.loadById(surveyId);
    return successful({});
  }
}
