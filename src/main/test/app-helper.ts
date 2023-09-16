import request from 'supertest';
import app from '@/main/config/app';

const isAppRunning = async (): Promise<boolean> => {
  const httpRequest = await request(app).post('/api/signup').send();
  if (httpRequest.statusCode !== 404) {
    return true;
  }
  return false;
};

export const waitForAppStart = async (): Promise<void> => {
  const maxRetries = 30;
  let retries = 0;
  while (retries < maxRetries) {
    if (await isAppRunning()) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    retries++;
  }

  if (retries === maxRetries) {
    throw new Error('App does not start in time');
  }
};
