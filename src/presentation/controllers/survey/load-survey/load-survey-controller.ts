import { successful } from 'presentation/helpers/http/http-helper';
import { type HttpRequest, type HttpResponse, type Controller, type LoadSurveys } from './load-survey-controller-protocols';

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load();
    return successful(surveys);
  }
}
