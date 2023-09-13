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
  type SaveSurveyResult
} from './save-survey-result-controller-protocols';
import { InvalidParamError } from '@/presentation/errors';

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const { accountId } = httpRequest;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (survey) {
        const answers = survey.answers.map((item) => item.answer);
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'));
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }

      if (accountId) {
        await this.saveSurveyResult.save({
          accountId,
          surveyId,
          answer,
          date: new Date()
        });
      } else {
        return forbidden(new InvalidParamError('accountId'));
      }

      return successful({});
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return serverError(error);
      }
      return serverError(new Error('Error while handle save survey result'));
    }
  }
}
