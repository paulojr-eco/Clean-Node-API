import { mockSaveSurveyResultRepository } from '@/data/test';
import { DbSaveSurveyResult } from './db-save-survey-result';
import {
  type SaveSurveyResultRepository
} from './db-save-survey-result-protocols';
import MockDate from 'mockdate';
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/test/mock-survey-result';

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return {
    sut,
    saveSurveyResultRepositoryStub
  };
};

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = vi.spyOn(saveSurveyResultRepositoryStub, 'save');
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    vi.spyOn(
      saveSurveyResultRepositoryStub,
      'save'
    ).mockReturnValueOnce(
      Promise.reject(new Error())
    );
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return a SurveyResult on success', async () => {
    const { sut } = makeSut();
    const surveyResultData = mockSaveSurveyResultParams();
    const surveyResult = await sut.save(surveyResultData);
    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
