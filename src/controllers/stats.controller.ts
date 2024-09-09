import { appConfig } from 'config';
import { type BotContext } from 'context';
import * as crypto from 'node:crypto';

export async function statsController(context: BotContext) {
  const user = context.state.user;
  /**
   * Generate token
   */
  const token = crypto.randomBytes(20).toString('hex');
  user.token = token;
  await user.save();
  const url = `${appConfig.uiUrl}?token=${token}`;
  await context.reply(url);
}
