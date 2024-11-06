import "reflect-metadata";
import { serve } from "@hono/node-server";
import { bot } from "bot/bot";
import { appConfig } from "config";
import database from "database";
import {
	MoodOfDay,
	SleepModel,
	SleepQuality,
	BoozeQuantity,
	BoozeModel,
} from "database/models";
import { logger } from "lib/logger";
import { app } from "server";
import { sub, subDays } from "date-fns";

const seedSleeps = async () => {
	const THREE_YEARS_DAYS = 365 * 3;
	const moods = Object.values(MoodOfDay);
	const qualities = Object.values(SleepQuality);

	for (let index = 0; index < THREE_YEARS_DAYS; index += 1) {
		const hoursInBed = Math.random() * 10;
		const wakeUpAt = subDays(new Date(), index);
		const goToBedAt = sub(new Date(), { days: index, hours: hoursInBed });

		const sleep = new SleepModel();
		sleep.userId = 1;
		sleep.moodOfDay = moods[Math.floor(Math.random() * moods.length)];
		sleep.wakeUpAt = wakeUpAt;
		sleep.goToBedAt = goToBedAt;
		sleep.quality = qualities[Math.floor(Math.random() * qualities.length)];
		await sleep.save();
	}
};

const seedBoozes = async () => {
	const THREE_YEARS_DAYS = 365 * 3;
	const quantities = Object.values(BoozeQuantity);
	const today = new Date();
	for (let index = 0; index < THREE_YEARS_DAYS; index += 1) {
		const quantity = quantities[Math.floor(Math.random() * quantities.length)];
		const date = subDays(today, index);
		const shouldCreateBooze = Math.random() > 0.7;
		if (!shouldCreateBooze) {
			continue;
		}
		await BoozeModel.save({
			userId: 1,
			createdAt: date,
			updatedAt: date,
			quantity,
		});
	}
};

const start = async () => {
	await database.initialize();
	// await seedSleeps();
	// await seedBoozes();
	logger.info("database - online");
	bot
		.start({
			onStart(botInfo) {
				logger.info(`bot - online, id ${botInfo.id}`);
			},
		})
		// eslint-disable-next-line promise/prefer-await-to-then
		.catch(async (error) => {
			logger.error(error);
			await database.destroy();
		});
	serve({ fetch: app.fetch, port: appConfig.port }, () => {
		logger.info(`server - online, port ${appConfig.port}`);
	});
};

start()
	.then(() => logger.info("all systems nominal"))
	.catch(logger.error);
