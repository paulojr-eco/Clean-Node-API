import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/test';
import { DbAuthentication } from './db-authentication';
import {
  type LoadAccountByEmailRepository,
  type HashComparer,
  type Encrypter,
  type UpdateAccessTokenRepository
} from './db-authentication-protocols';
import { mockAuthentication } from '@/domain/test';

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updatedAccessTokenRepositoryStub: UpdateAccessTokenRepository
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const hashComparerStub = mockHashComparer();
  const encrypterStub = mockEncrypter();
  const updatedAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updatedAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updatedAccessTokenRepositoryStub
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.auth(mockAuthentication());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      Promise.reject(new Error())
    );
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      Promise.resolve(null)
    );
    const acessToken = await sut.auth(mockAuthentication());
    expect(acessToken).toBeNull();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = vi.spyOn(hashComparerStub, 'compare');
    await sut.auth(mockAuthentication());
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_password');
  });

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    vi.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      Promise.reject(new Error())
    );
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    vi.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      Promise.resolve(false)
    );
    const acessToken = await sut.auth(mockAuthentication());
    expect(acessToken).toBeNull();
  });

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut();
    const generateSpy = vi.spyOn(encrypterStub, 'encrypt');
    await sut.auth(mockAuthentication());
    expect(generateSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    vi.spyOn(encrypterStub, 'encrypt').mockImplementation(() => {
      throw new Error();
    });
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test('Should return a token on success', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(mockAuthentication());
    expect(accessToken).toBe('any_token');
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updatedAccessTokenRepositoryStub } = makeSut();
    const updateSpy = vi.spyOn(updatedAccessTokenRepositoryStub, 'updateAccessToken');
    await sut.auth(mockAuthentication());
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updatedAccessTokenRepositoryStub } = makeSut();
    vi.spyOn(updatedAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(
      Promise.reject(new Error())
    );
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
