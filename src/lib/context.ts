import type { ConversationFlavor } from "npm:@grammyjs/conversations";
import type { UserModel } from "database/models";
import type { Context, SessionFlavor } from "npm:grammy";

export type BotContext =
	& Context
	& ConversationFlavor
	& SessionFlavor<Record<string, unknown>>
	& {
		state: {
			user: UserModel;
		};
	};
