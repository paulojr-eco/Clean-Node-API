import { type HttpRequest, type HttpResponse, type Controller, type LoadSurveys } from './load-survey-controller-protocols';

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load();
    return { statusCode: 200, body: '' };
  }
}
