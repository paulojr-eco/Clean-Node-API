import { type LoadAccountByEmailRepository } from 'data/protocols/load-account-by-email-repository';
import { type Authentication, type AuthenticationModel } from 'domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository;
  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    await this.loadAccountByEmailRepository.load(authentication.email);
    return null;
  }
}