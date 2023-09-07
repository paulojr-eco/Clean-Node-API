import { type Decrypter } from 'data/protocols/criptography/decrypter';
import { type LoadAccountByToken } from '../../../domain/usecases/load-account-by-token';
import { type AccountModel } from '../add-account/db-add-account-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}

  async load (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
    this.decrypter.decrypt(accessToken);
    return await new Promise(resolve => { resolve(null); });
  }
}
