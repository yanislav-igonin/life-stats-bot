import { type ConversationFlavor } from '@grammyjs/conversations';
import { type UserModel } from 'database/models';
import { type Context, type SessionFlavor } from 'grammy';

export type BotContext = Context &
  ConversationFlavor &
  SessionFlavor<{}> & {
    state: {
      user: UserModel;
    };
  };
