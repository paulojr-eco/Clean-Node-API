import { LoadSurveysController } from './load-survey-controller';
import MockDate from 'mockdate';
import { type LoadSurveys } from './load-survey-controller-protocols';
import {
  noContent,
  serverError,
  successful
} from '@/presentation/helpers/http/http-helper';
import { throwError } from '@/domain/test';
import { mockLoadSurveys } from '@/presentation/test';
import { mockSurveysModel } from '@/domain/test/mock-survey';

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
};

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);
  return {
    sut,
    loadSurveysStub
  };
};

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = vi.spyOn(loadSurveysStub, 'load');
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });

  test('Should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(successful(mockSurveysModel()));
  });

  test('Should return 204 is LoadSurveys return an empty array', async () => {
    const { sut, loadSurveysStub } = makeSut();
    vi.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut();
    vi.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should throw a generic error if LoadSurveysController throws an error that is not a instance of Error', async () => {
    const { sut, loadSurveysStub } = makeSut();
    vi.spyOn(loadSurveysStub, 'load').mockImplementationOnce(async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      return await Promise.reject(null);
    });
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(
      serverError(new Error('Error while handle load surveys'))
    );
  });
});
