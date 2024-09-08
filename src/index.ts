// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata';
import { appConfig } from 'config/app.config';
import { type BotContext } from 'context';
import database from 'database';
import { Bot, Keyboard } from 'grammy';
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

const keyboard = new Keyboard();
keyboard.add(replies.start, replies.help);

bot.command('start', async (context) => {
  await context.reply(replies.start, { reply_markup: keyboard });
});

bot.command('help', async (context) => {
  await context.reply(replies.help);
});

bot.on('message:text', async (context) => {
  // const { user, chat } = context.state;
  const text = context.message.text;
  const { message_id: replyToMessageId } = context.message;

  try {
    const botMessage = `Echo: ${text}`;
    await context.reply(botMessage, {
      reply_to_message_id: replyToMessageId,
    });
  } catch (error) {
    await context.reply(replies.error);
    throw error;
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
