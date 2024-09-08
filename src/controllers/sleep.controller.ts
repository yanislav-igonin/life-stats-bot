import { type Conversation } from '@grammyjs/conversations';
import { type BotContext } from 'context';
import { SleepModel, SleepQuality } from 'database/models';
import { sleepKeyboard, sleepQualityKeyboard, startKeyboard } from 'keyboards';
import { DateTime } from 'luxon';
import { replies } from 'replies';
import { MoreThan } from 'typeorm';

enum SleepType {
  GoToBed = 'go_to_bed',
  WakeUp = 'wake_up',
}

export async function sleepController(
  conversation: Conversation<BotContext>,
  context: BotContext,
) {
  await context.reply('Выберите действие', { reply_markup: sleepKeyboard });

  let response = await conversation.waitFor('message:text');

  let sleep: SleepModel | null = null;
  const twelveHoursAgo = DateTime.now().minus({ hours: 12 }).toJSDate();
  let type: SleepType | null = null;

  if (response.message.text === 'Подъем') {
    type = SleepType.WakeUp;
  }

  if (response.message.text === 'Отход ко сну') {
    type = SleepType.GoToBed;
  }

  if (!type) {
    await context.reply('Неизвестное действие');
    return;
  }

  if (type === SleepType.WakeUp) {
    /**
     * Search for existed record with go to bed time not more than 12 hours ago
     */
    sleep = await SleepModel.findOne({
      order: { createdAt: 'DESC' },
      where: {
        goToBedAt: MoreThan(twelveHoursAgo),
        userId: context.state.user.id,
      },
    });
  }

  if (!sleep) {
    sleep = new SleepModel();
    sleep.user = context.state.user;
  }

  if (type === SleepType.GoToBed) {
    sleep.goToBedAt = DateTime.now().toJSDate();
  }

  if (type === SleepType.WakeUp) {
    sleep.wakeUpAt = DateTime.now().toJSDate();
    await context.reply('Выспался?', {
      reply_markup: sleepQualityKeyboard,
      reply_to_message_id: response.message.message_id,
    });
    response = await conversation.waitFor('message:text');
    // eslint-disable-next-line require-atomic-updates
    sleep.quality =
      SleepQuality[response.message.text as keyof typeof SleepQuality];
  }

  await conversation.external(async () => await sleep.save());

  await context.reply(replies.recordCreated, {
    reply_markup: startKeyboard,
    reply_to_message_id: response.message.message_id,
  });
}
