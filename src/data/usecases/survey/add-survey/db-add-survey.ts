import {
  type AddSurveyRepository,
  type AddSurvey,
  type AuthenticationParams
} from './db-add-survey-protocols';

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (data: AuthenticationParams): Promise<void> {
    await this.addSurveyRepository.add(data);
  }
}
