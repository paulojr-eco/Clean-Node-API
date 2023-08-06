import { type Collection, MongoClient } from 'mongodb';
import env from '../../../../main/config/env';

export const MongoHelper = {
  client: new MongoClient(
    env.mongoUrl,
    {
      monitorCommands: true
    }
  ),
  async connect (): Promise<void> {
    await this.client.connect();
  },
  async disconnect (): Promise<void> {
    await this.client.close();
  },
  getCollection (name: string): Collection {
    return this.client.db().collection(name);
  },
  map (collection: any): any {
    const { _id, ...collectionWithoutId } = collection;
    return { id: _id.toString(), ...collectionWithoutId };
  }
};
