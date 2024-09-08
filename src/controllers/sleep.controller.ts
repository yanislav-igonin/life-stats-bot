import { type BotContext } from 'context';
import { SleepModel, SleepType } from 'database/models';
import { Keyboard } from 'grammy';

async function wakeUpController(context: BotContext) {
  const { user } = context.state;
  const sleep = new SleepModel();
  sleep.user = user;
  sleep.type = SleepType.WakeUp;
  await sleep.save();
}

async function goToBedController(context: BotContext) {
  const { user } = context.state;
  const sleep = new SleepModel();
  sleep.user = user;
  sleep.type = SleepType.GoToBed;
  await sleep.save();
}

const sleepKeyboard = new Keyboard();
sleepKeyboard.add('Подъем', 'Отход ко сну');
export async function sleepController(context: BotContext) {
  await context.reply('Выберите действие', { reply_markup: sleepKeyboard });
}
