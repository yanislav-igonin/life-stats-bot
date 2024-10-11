import { UserModel } from "../database/models/index.ts";
import type { NextFunction } from "npm:grammy";
import type { BotContext } from "../lib/context.ts";

export const stateMiddleware = async (
	context: BotContext,
	next: NextFunction,
) => {
	context.state = {};
	await next();
};

export const userMiddleware = async (
	context: BotContext,
	next: NextFunction,
) => {
	const { from: user } = context;
	if (!user) {
		await next();
		return;
	}

	const {
		id: userId,
		first_name: firstName,
		language_code: language,
		last_name: lastName,
		username,
	} = user;

	const databaseUser = await UserModel.findOneBy({ tgId: userId.toString() });
	if (databaseUser) {
		// Update user info
		databaseUser.firstName = firstName;
		databaseUser.language = language;
		databaseUser.lastName = lastName;
		databaseUser.username = username;
		await databaseUser.save();

		context.state.user = databaseUser;
		await next();
		return;
	}

	const newUser = await UserModel.create({
		firstName,
		language,
		lastName,
		tgId: userId.toString(),
		username,
	}).save();
	context.state.user = newUser;

	await next();
};
