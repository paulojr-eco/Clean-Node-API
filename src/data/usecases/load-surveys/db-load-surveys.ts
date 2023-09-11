import { type LoadSurveysRepository } from '../../../data/protocols/db/survey/load-surveys-repository';
import { type SurveyModel } from '../../../domain/models/survey';
import { type LoadSurveys } from '../../../domain/usecases/load-surveys';

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.loadAll();
    return [];
  }
}