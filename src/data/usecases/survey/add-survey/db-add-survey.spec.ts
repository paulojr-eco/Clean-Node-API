import { mockAddSurveyRepository } from '@/data/test';
import { DbAddSurvey } from './db-add-survey';
import { type AddSurveyRepository } from './db-add-survey-protocols';
import MockDate from 'mockdate';
import { mockAddSurveyParams } from '@/domain/test/mock-survey';

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return {
    sut,
    addSurveyRepositoryStub
  };
};

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = vi.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = mockAddSurveyParams();
    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    vi.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(
      Promise.reject(new Error())
    );
    const promise = sut.add(mockAddSurveyParams());
    await expect(promise).rejects.toThrow();
  });
});
