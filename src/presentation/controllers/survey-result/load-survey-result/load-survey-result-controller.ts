import {
  forbidden,
  serverError,
  successful
} from '@/presentation/helpers/http/http-helper';
import {
  type LoadSurveyById,
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type LoadSurveyResult
} from './load-survey-result-controller-protocols';
import { InvalidParamError } from '@/presentation/errors';

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      await this.loadSurveyResult.load(surveyId);
      return successful({});
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return serverError(error);
      }
      return serverError(new Error('Error while handle load survey result'));
    }
  }
}
