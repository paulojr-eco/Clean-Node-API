import {
  type SaveSurveyResultRepository,
  type SurveyResultModel,
  type SaveSurveyResultModel,
  type SaveSurveyResult
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data);
    return {
      id: '',
      surveyId: '',
      accountId: '',
      answer: '',
      date: new Date()
    };
  }
}
