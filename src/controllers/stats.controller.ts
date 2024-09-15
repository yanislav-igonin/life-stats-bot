import { appConfig } from 'config';
import { type BotContext } from 'lib/context';
import * as crypto from 'node:crypto';

export async function statsController(context: BotContext) {
  const user = context.state.user;
  const token = crypto.randomBytes(20).toString('hex');
  user.token = token;
  await user.save();
  const url = `${appConfig.uiUrl}/auth/${token}`;
  await context.reply(url, {
    entities: [{ length: url.length, offset: 0, type: 'url' }],
  });
}
