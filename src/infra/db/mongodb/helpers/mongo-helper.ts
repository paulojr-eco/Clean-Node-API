import { type Collection, MongoClient } from 'mongodb';
import env from '@/main/config/env';

const isConnected = async (client: MongoClient): Promise<boolean> => {
  let res;
  try {
    res = await client.db('admin').command({ ping: 1 });
  } catch (err) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(res, 'ok') && res.ok === 1;
};

const makeMongoClient = (): MongoClient => {
  return new MongoClient(env.mongoUrl, {
    monitorCommands: true
  });
};

export const MongoHelper = {
  client: makeMongoClient(),
  async connect (): Promise<void> {
    await this.client.connect();
  },
  async disconnect (): Promise<void> {
    await this.client.close();
  },
  async getCollection (name: string): Promise<Collection> {
    if (!await isConnected(this.client)) {
      this.client = makeMongoClient();
      await this.connect();
    }
    return this.client.db().collection(name);
  },
  map (data: any): any {
    const { _id, ...collectionWithoutId } = data;
    console.log('Id que veio: ', _id);
    return { id: _id.toString(), ...collectionWithoutId };
  },
  mapCollection (collection: any[]): any[] {
    return collection.map(item => MongoHelper.map(item));
  }
};
