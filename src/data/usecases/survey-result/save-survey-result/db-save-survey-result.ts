import {
  type SaveSurveyResultRepository,
  type SurveyResultModel,
  type SaveSurveyResultParams,
  type SaveSurveyResult,
  type LoadSurveyResultRepository
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data);
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return surveyResult!;
  }
}
