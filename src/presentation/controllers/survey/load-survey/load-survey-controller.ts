import { noContent, serverError, successful } from '@/presentation/helpers/http/http-helper';
import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type LoadSurveys
} from './load-survey-controller-protocols';

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      return surveys.length ? successful(surveys) : noContent();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return serverError(error);
      }
      return serverError(new Error('Error while handle load surveys'));
    }
  }
}
