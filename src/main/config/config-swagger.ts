import swaggerConfig from '@/main/docs';
import { type Express } from 'express';
import { bodyParser } from '../middlewares';
import { noCache } from '@/main/middlewares/no-cache';
import { serve, setup } from 'swagger-ui-express';

export default (app: Express): void => {
  app.use(bodyParser);
  app.use('/api-docs', noCache, serve, setup(swaggerConfig));
};
