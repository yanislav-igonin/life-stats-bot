import { serve } from '@hono/node-server';
import { bot } from 'bot';
import { appConfig } from 'config';
import database from 'database';
import { logger } from 'lib/logger';
import { app } from 'server';

const start = async () => {
  await database.initialize();
  logger.info('database - online');
  bot
    .start({
      onStart(botInfo) {
        logger.info(`bot - online, id ${botInfo.id}`);
      },
    })
    // eslint-disable-next-line promise/prefer-await-to-then
    .catch(async (error) => {
      logger.error(error);
      await database.destroy();
    });
  serve({ fetch: app.fetch, port: appConfig.port }, () => {
    logger.info(`server - online, port ${appConfig.port}`);
  });
};

start()
  .then(() => logger.info('all systems nominal'))
  .catch(logger.error);
