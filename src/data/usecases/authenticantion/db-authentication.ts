import { type HashComparer } from 'data/protocols/criptography/hash-comparer';
import { type LoadAccountByEmailRepository } from 'data/protocols/db/load-account-by-email-repository';
import {
  type Authentication,
  type AuthenticationModel
} from 'domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashComparer: HashComparer;
  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
  }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );
    console.log('authentication.password: ', authentication.password);
    if (account) {
      await this.hashComparer.compare(
        authentication.password,
        account.password
      );
    }
    return null;
  }
}
