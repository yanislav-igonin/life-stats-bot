import "reflect-metadata";
import { serve } from "@hono/node-server";
import { bot } from "bot";
import { appConfig } from "config";
import database from "database";
import { MoodOfDay, SleepModel, SleepQuality } from "database/models";
import { logger } from "lib/logger";
import { app } from "server";
import { sub, subDays } from "date-fns";

const seedSleeps = async () => {
	const THREE_YEARS_DAYS = 365 * 3;
	for (let index = 0; index < THREE_YEARS_DAYS; index += 1) {
		const hoursInBed = Math.random() * 10;
		const wakeUpAt = subDays(new Date(), index);
		const goToBedAt = sub(new Date(), { days: index, hours: hoursInBed });
		const moods = Object.values(MoodOfDay);
		const qualities = Object.values(SleepQuality);

		const sleep = new SleepModel();
		sleep.userId = 1;
		sleep.moodOfDay = moods[Math.floor(Math.random() * moods.length)];
		sleep.wakeUpAt = wakeUpAt;
		sleep.goToBedAt = goToBedAt;
		sleep.quality = qualities[Math.floor(Math.random() * qualities.length)];
		await sleep.save();
	}
};

const start = async () => {
	await database.initialize();
	// await seedSleeps();
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
