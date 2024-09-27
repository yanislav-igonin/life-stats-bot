import type { ConversationFlavor } from "@grammyjs/conversations";
import type { UserModel } from "database/models";
import type { Context, SessionFlavor } from "grammy";

export type BotContext = Context &
	ConversationFlavor &
	SessionFlavor<Record<string, unknown>> & {
		state: {
			user: UserModel;
		};
	};
