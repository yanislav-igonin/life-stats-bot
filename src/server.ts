import { SleepModel, UserModel } from "database/models";
import type { MoodOfDay, SleepQuality } from "database/models";
import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";
import { Between } from "typeorm";

const app = new Hono();
app.use("*", cors({ origin: ["*"] }));

class SuccessResponse {
	ok = true;

	data: unknown;

	constructor(data: unknown) {
		this.data = data;
	}
}

class ErrorResponse {
	ok = false;

	data: unknown;

	constructor(data: unknown) {
		this.data = data;
	}
}

const auth = async (context: Context) => {
	const token = context.req.header("Authorization")?.replace("Bearer ", "");
	if (!token) {
		context.status(401);
		return context.json(new ErrorResponse("Unauthorized"));
	}

	const user = await UserModel.findOneBy({
		token,
	});
	if (!user) {
		context.status(401);
		return context.json(new ErrorResponse("Unauthorized"));
	}

	context.set("user", user);
};

app.get("/auth", async (context) => {
	await auth(context);
	// @ts-expect-error - user is set in auth
	const user: UserModel = context.get("user");
	return context.json(new SuccessResponse(user));
});

app.get("/sleep/list", async (context) => {
	await auth(context);
	// @ts-expect-error - user is set in auth
	const user: UserModel = context.get("user");

	const { from, to } = context.req.query();
	const sleeps = await SleepModel.find({
		order: {
			goToBedAt: "ASC",
		},
		select: ["id", "goToBedAt", "wakeUpAt", "quality", "moodOfDay"],
		where: {
			userId: user.id,
			goToBedAt: Between(new Date(from), new Date(to)),
		},
	});
	return context.json(new SuccessResponse(sleeps));
});

app.get("/sleep/:id", async (context) => {
	await auth(context);
	// @ts-expect-error - user is set in auth
	const user: UserModel = context.get("user");

	const { id } = context.req.param();

	const sleep = await SleepModel.findOneBy({
		id: Number.parseInt(id, 10),
		userId: user.id,
	});

	if (!sleep) {
		return context.json(new ErrorResponse("Sleep not found"));
	}

	return context.json(new SuccessResponse(sleep));
});

type SleepBody = {
	id: number;
	wakeUpAt: string;
	goToBedAt: string;
	moodOfDay: MoodOfDay;
	quality: SleepQuality;
};

app.post("/sleep/save", async (context) => {
	await auth(context);
	// @ts-expect-error - user is set in auth
	const user: UserModel = context.get("user");

	const { id, wakeUpAt, goToBedAt, moodOfDay, quality } =
		await context.req.json<SleepBody>();

	const sleep = await SleepModel.findOneBy({
		id,
		userId: user.id,
	});

	if (!sleep) {
		return context.json(new ErrorResponse("Sleep not found"));
	}

	sleep.wakeUpAt = new Date(wakeUpAt) ?? sleep.wakeUpAt;
	sleep.goToBedAt = new Date(goToBedAt) ?? sleep.goToBedAt;
	sleep.moodOfDay = moodOfDay ?? sleep.moodOfDay;
	sleep.quality = quality ?? sleep.quality;

	await sleep.save();

	return context.json(new SuccessResponse(sleep));
});

export { app };
