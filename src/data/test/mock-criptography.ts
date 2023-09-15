import { type Decrypter } from '../protocols/criptography/decrypter';
import { type Encrypter } from '../protocols/criptography/encrypter';
import { type HashComparer } from '../protocols/criptography/hash-comparer';
import { type Hasher } from '../protocols/criptography/hasher';

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('any_password');
    }
  }
  return new HasherStub();
};

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt (value: string): string {
      return 'any_value';
    }
  }
  return new DecrypterStub();
};

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt (id: string): string {
      return 'any_token';
    }
  }
  return new EncrypterStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true);
    }
  }
  return new HashComparerStub();
};
