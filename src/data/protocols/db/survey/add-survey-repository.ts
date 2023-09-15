import { type AuthenticationParams } from '@/domain/usecases/survey/add-survey';

export interface AddSurveyRepository {
  add: (surveyData: AuthenticationParams) => Promise<void>
}
