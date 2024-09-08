import { type Conversation } from '@grammyjs/conversations';
import { type BotContext } from 'context';
import { SleepModel, SleepType } from 'database/models';
import { sleepKeyboard, startKeyboard } from 'keyboards';

export async function sleepController(
  conversation: Conversation<BotContext>,
  context: BotContext,
) {
  await context.reply('Выберите действие', { reply_markup: sleepKeyboard });

  const response = await conversation.waitFor('message:text');

  let type: SleepType;
  if (response.message.text === 'Подъем') {
    type = SleepType.WakeUp;
  } else if (response.message.text === 'Отход ко сну') {
    type = SleepType.GoToBed;
  } else {
    await context.reply('Неизвестное действие');
    return;
  }

  const sleep = new SleepModel();
  sleep.user = context.state.user;
  sleep.type = type;
  await sleep.save();

  await context.reply('Запись создана', {
    reply_markup: startKeyboard,
    reply_to_message_id: response.message.message_id,
  });
}
