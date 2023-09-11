import { LoadSurveysController } from './load-survey-controller';
import MockDate from 'mockdate';
import { type SurveyModel, type LoadSurveys } from './load-survey-controller-protocols';
import { serverError, successful } from 'presentation/helpers/http/http-helper';

const makeFakeSurveys = (): SurveyModel[] => {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }, {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }];
};

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => { resolve(makeFakeSurveys()); });
    }
  }
  return new LoadSurveysStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys();
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
    expect(httpResponse).toEqual(successful(makeFakeSurveys()));
  });

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut();
    vi.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()); })
    );
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
    expect(httpResponse).toEqual(serverError(new Error('Error while handle load surveys')));
  });
});
