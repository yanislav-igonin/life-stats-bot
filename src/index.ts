// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata';
import { conversations, createConversation } from '@grammyjs/conversations';
import { appConfig } from 'config/app.config';
import { type BotContext } from 'context';
import { sleepController } from 'controllers/sleep.controller';
import database from 'database';
import { Bot, session } from 'grammy';
import { startKeyboard } from 'keyboards';
import { logger } from 'logger';
import {
  allowedUserMiddleware,
  stateMiddleware,
  userMiddleware,
} from 'middlewares';
import { replies } from 'replies';

const bot = new Bot<BotContext>(appConfig.botToken);
bot.catch(logger.error);
bot.use(stateMiddleware);
bot.use(userMiddleware);
bot.use(allowedUserMiddleware);
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(sleepController));

bot.command('start', async (context) => {
  await context.reply(replies.start, { reply_markup: startKeyboard });
});

async function helpController(context: BotContext) {
  await context.reply(replies.help, { reply_markup: startKeyboard });
}

bot.command('help', helpController);

bot.on('message:text', async (context) => {
  const {
    message: { text },
  } = context;
  if (text === 'Помощь') {
    await helpController(context);
    return;
  }

  if (text === 'Сон') {
    await context.conversation.enter('sleepController');
  }
});

const start = async () => {
  await database.initialize();
  logger.info('database connected');
  // eslint-disable-next-line promise/prefer-await-to-then
  bot.start().catch(async (error) => {
    logger.error(error);
    await database.destroy();
  });
};

start()
  .then(() => logger.info('bot started'))
  .catch(logger.error);
