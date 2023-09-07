import { type Decrypter } from 'data/protocols/criptography/decrypter';
import { type LoadAccountByToken } from '../../../domain/usecases/load-account-by-token';
import { type AccountModel } from '../add-account/db-add-account-protocols';
import { type LoadAccountByTokenRepository } from 'data/protocols/db/account/load-account-by-token-repository';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (
    accessToken: string,
    role?: string | undefined
  ): Promise<AccountModel | null> {
    const token = this.decrypter.decrypt(accessToken);
    if (token) {
      await this.loadAccountByTokenRepository.loadByToken(accessToken, role);
    }
    return await new Promise((resolve) => {
      resolve(null);
    });
  }
}
