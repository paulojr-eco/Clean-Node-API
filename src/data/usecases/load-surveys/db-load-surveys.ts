import { type LoadSurveysRepository } from '../../protocols/db/survey/load-survey-by-id-repository';
import { type SurveyModel } from '../../../domain/models/survey';
import { type LoadSurveys } from '../../../domain/usecases/load-surveys';

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll();
    return surveys;
  }
}
