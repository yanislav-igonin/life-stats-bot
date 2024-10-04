import { BaseModel } from "./base.model";
import { UserModel } from "./user.model";
import { Column, Entity, ManyToOne } from "typeorm";

export enum BoozeQuantity {
	"🤤" = "low",
	"🥴" = "medium",
	"🤢" = "high",
}

@Entity({ name: "booze" })
export class BoozeModel extends BaseModel {
	/**
	 * User id to which the booze drinking belongs
	 */
	@Column()
	userId!: number;

	/**
	 * User to which the booze drinking belongs
	 */
	@ManyToOne(
		() => UserModel,
		(user) => user.sleeps,
	)
	user!: UserModel;

	/**
	 * Quantity of booze
	 */
	@Column({
		enum: Object.values(BoozeQuantity),
		enumName: "boozeQuantityEnum",
		nullable: true,
		type: "enum",
	})
	quantity!: BoozeQuantity;
}
