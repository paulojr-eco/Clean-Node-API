import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = vi.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    const sut = makeSut();
    vi.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hash' as never);
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hash');
  });

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();
    vi.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      await Promise.reject(new Error());
    });
    const promise = sut.encrypt('any_value');
    await expect(promise).rejects.toThrow();
  });
});
