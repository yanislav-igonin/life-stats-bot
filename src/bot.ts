// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata';
import { conversations, createConversation } from '@grammyjs/conversations';
import { appConfig } from 'config/app.config';
import { sleepController } from 'controllers/sleep.controller';
import { statsController } from 'controllers/stats.controller';
import { Bot, session } from 'grammy';
import { type BotContext } from 'lib/context';
import { startKeyboard } from 'lib/keyboards';
import { logger } from 'lib/logger';
import { stateMiddleware, userMiddleware } from 'lib/middlewares';
import { replies } from 'lib/replies';

const bot = new Bot<BotContext>(appConfig.botToken);
bot.catch(async (error) => {
  if (!error.message.includes('UserError')) {
    logger.error(error);
  }

  const message = error.message
    .replace('UserError in middleware: ', '')
    .replace('Error in middleware: ', '');

  await error.ctx.reply(message, {
    reply_markup: startKeyboard,
    // @ts-expect-error Lazy to put type
    reply_to_message_id: error.ctx.message.message_id,
  });
});
bot.use(stateMiddleware);
bot.use(userMiddleware);
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

  if (text === 'Статистика') {
    await statsController(context);
  }
});

export { bot };
