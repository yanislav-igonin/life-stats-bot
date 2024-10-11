import { BaseModel } from "./base.model";
import { UserModel } from "./user.model";
import { Column, Entity, ManyToOne } from "npm:typeorm";

export enum SleepQuality {
	"😡" = "very_bad",
	"😠" = "bad",
	"🤨" = "meh",
	"😌" = "good",
	"🥹" = "very_good",
}

export enum MoodOfDay {
	"😡" = "very_bad",
	"😠" = "bad",
	"🤨" = "meh",
	"😌" = "good",
	"🥹" = "very_good",
}

@Entity({ name: "sleeps" })
export class SleepModel extends BaseModel {
	/**
	 * User id to which the sleep belongs
	 */
	@Column()
	userId!: number;

	/**
	 * User to which the sleep belongs
	 */
	@ManyToOne(
		() => UserModel,
		(user) => user.sleeps,
	)
	user!: UserModel;

	/**
	 * Wake up time
	 */
	@Column({ nullable: true, type: "timestamp" })
	wakeUpAt?: Date;

	/**
	 * Go to bed time
	 */
	@Column({ nullable: true, type: "timestamp" })
	goToBedAt?: Date;

	/**
	 * Quality of sleep, asked on wake up
	 */
	@Column({
		enum: Object.values(SleepQuality),
		enumName: "sleepsQualityEnum",
		nullable: true,
		type: "enum",
	})
	quality?: SleepQuality;

	/**
	 * Mood of day, asked before sleep
	 */
	@Column({
		enum: Object.values(MoodOfDay),
		enumName: "moodOfDayEnum",
		nullable: true,
		type: "enum",
	})
	moodOfDay?: MoodOfDay;
}
