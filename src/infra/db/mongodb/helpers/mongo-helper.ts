import { type Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: new MongoClient(
    process.env.MONGO_URL ?? 'mongodb://localhost:27017',
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
  }
};
