import { conversations, createConversation } from "npm:@grammyjs/conversations";
import { appConfig } from "./config/app.config.ts";
import { boozeController } from "./controllers/booze.controller.ts";
import { sleepController } from "./controllers/sleep.controller.ts";
import { statsController } from "./controllers/stats.controller.ts";
import { Bot, session } from "npm:grammy";
import type { BotContext } from "./lib/context.ts";
import { startKeyboard } from "./lib/keyboards.ts";
import { logger } from "./lib/logger.ts";
import { stateMiddleware, userMiddleware } from "./lib/middlewares.ts";
import { replies } from "./lib/replies.ts";

const bot = new Bot<BotContext>(appConfig.botToken);
bot.catch(async (error) => {
	if (!error.message.includes("UserError")) {
		logger.error(error);
	}

	const message = error.message
		.replace("UserError in middleware: ", "")
		.replace("Error in middleware: ", "");

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
bot.use(createConversation(boozeController));

bot.command("start", async (context) => {
	await context.reply(replies.start, { reply_markup: startKeyboard });
});

async function helpController(context: BotContext) {
	await context.reply(replies.help, { reply_markup: startKeyboard });
}

bot.command("help", helpController);

bot.on("message:text", async (context) => {
	const {
		message: { text },
	} = context;
	if (text === "Помощь") {
		await helpController(context);
		return;
	}

	if (text === "Сон") {
		await context.conversation.enter("sleepController");
	}

	if (text === "Бухло") {
		await context.conversation.enter("boozeController");
	}

	if (text === "Статистика") {
		await statsController(context);
	}
});

export { bot };
