import type { Conversation } from "@grammyjs/conversations";
import { BoozeModel, BoozeQuantity } from "database/models";
import type { BotContext } from "lib/context";
import { quantityOfBoozeKeyboard, startKeyboard } from "lib/keyboards";
import { replies } from "lib/replies";

export class UserError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UserError";
	}
}

const isValidQuantityOfBooze = (
	quantity: BoozeQuantity,
): quantity is BoozeQuantity => {
	return quantity.length === 2 && Object.keys(BoozeQuantity).includes(quantity);
};

export async function boozeController(
	conversation: Conversation<BotContext>,
	context: BotContext,
) {
	await context.reply("Сколько?", { reply_markup: quantityOfBoozeKeyboard });
	const response = await conversation.waitFor("message:text");

	if (!isValidQuantityOfBooze(response.message.text as BoozeQuantity)) {
		throw new UserError("Неверная опция количества бухла");
	}

	const quantity =
		BoozeQuantity[response.message.text as keyof typeof BoozeQuantity];

	await conversation.external(
		async () =>
			await BoozeModel.save({
				user: context.state.user,
				quantity,
			}),
	);

	await context.reply(replies.recordCreated, {
		reply_markup: startKeyboard,
		reply_to_message_id: response.message.message_id,
	});
}
