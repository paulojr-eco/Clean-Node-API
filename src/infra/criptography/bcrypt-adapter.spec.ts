import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const sut = makeSut();
    const hashSpy = vi.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut();
    vi.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hash' as never);
    const hash = await sut.hash('any_value');
    expect(hash).toBe('hash');
  });

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();
    vi.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      await Promise.reject(new Error());
    });
    const promise = sut.hash('any_value');
    await expect(promise).rejects.toThrow();
  });

  test('Should call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = vi.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  test('Should return true when compare succeeds', async () => {
    const sut = makeSut();
    vi.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(true);
  });

  test('Should return false when compare fails', async () => {
    const sut = makeSut();
    vi.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false) as any);
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(false);
  });
});
