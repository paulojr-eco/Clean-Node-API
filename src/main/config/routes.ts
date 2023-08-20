import { type Express, Router } from 'express';
import { readdirSync } from 'fs';
import path from 'path';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  // fg.sync('**/src/main/routes/**routes.ts').map(async (file) =>
  //   (await import(`../../../${file}`)).default(router)
  // );
  const routesDirectory = path.join(__dirname, '..', 'routes');
  readdirSync(routesDirectory).map(async (file) => {
    if (!file.includes('.test.')) {
      console.log(file);
      const modulePath = path.join(routesDirectory, file);
      const routeModule = await import(modulePath);
      routeModule.default(router);
    }
  });
};
