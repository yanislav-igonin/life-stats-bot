import type { Conversation } from "@grammyjs/conversations";
import { MoodOfDay, SleepModel, SleepQuality } from "database/models";
import { subHours } from "date-fns";
import type { BotContext } from "lib/context";
import {
	moodOfDayKeyboard,
	sleepKeyboard,
	sleepQualityKeyboard,
	startKeyboard,
} from "lib/keyboards";
import { replies } from "lib/replies";
import { MoreThan } from "typeorm";

export class UserError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UserError";
	}
}

enum SleepType {
	GoToBed = "go_to_bed",
	WakeUp = "wake_up",
}

const isValidSleepQuality = (
	quality: SleepQuality,
): quality is SleepQuality => {
	return quality.length === 2 && Object.keys(SleepQuality).includes(quality);
};

const isValidMoodOfDay = (mood: MoodOfDay): mood is MoodOfDay => {
	return mood.length === 2 && Object.keys(MoodOfDay).includes(mood);
};

export async function sleepController(
	conversation: Conversation<BotContext>,
	context: BotContext,
) {
	await context.reply("Выберите действие", { reply_markup: sleepKeyboard });

	let response = await conversation.waitFor("message:text");

	let sleep: SleepModel | null = null;
	const twelveHoursAgo = subHours(new Date(), 12);
	let type: SleepType | null = null;

	if (response.message.text === "Подъем") {
		type = SleepType.WakeUp;
	}

	if (response.message.text === "Отход ко сну") {
		type = SleepType.GoToBed;
	}

	if (!type) {
		await context.reply("Неизвестное действие");
		return;
	}

	if (type === SleepType.WakeUp) {
		/**
		 * Search for existed record with go to bed time not more than 12 hours ago
		 */
		sleep = await SleepModel.findOne({
			order: { createdAt: "DESC" },
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
		sleep.goToBedAt = new Date();
		await context.reply("Настроение за день?", {
			reply_markup: moodOfDayKeyboard,
			reply_to_message_id: response.message.message_id,
		});
		response = await conversation.waitFor("message:text");
		if (!isValidMoodOfDay(response.message.text as MoodOfDay)) {
			throw new UserError("Неверная опция настроения за день");
		}

		sleep.moodOfDay =
			MoodOfDay[response.message.text as keyof typeof MoodOfDay];
	}

	if (type === SleepType.WakeUp) {
		sleep.wakeUpAt = new Date();
		await context.reply("Выспался?", {
			reply_markup: sleepQualityKeyboard,
			reply_to_message_id: response.message.message_id,
		});
		response = await conversation.waitFor("message:text");
		if (!isValidSleepQuality(response.message.text as SleepQuality)) {
			throw new UserError("Неверная опция качества сна");
		}

		sleep.quality =
			SleepQuality[response.message.text as keyof typeof SleepQuality];
	}

	await conversation.external(async () => await sleep.save());

	await context.reply(replies.recordCreated, {
		reply_markup: startKeyboard,
		reply_to_message_id: response.message.message_id,
	});
}
