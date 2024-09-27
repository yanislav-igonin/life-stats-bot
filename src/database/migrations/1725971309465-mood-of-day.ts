import { type MigrationInterface, type QueryRunner } from "typeorm";

export class MoodOfDay1725971309465 implements MigrationInterface {
	name = "MoodOfDay1725971309465";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."moodOfDayEnum" AS ENUM('very_bad', 'bad', 'meh', 'good', 'very_good')`,
		);
		await queryRunner.query(
			`ALTER TABLE "sleeps" ADD "moodOfDay" "public"."moodOfDayEnum"`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "sleeps" DROP COLUMN "moodOfDay"`);
		await queryRunner.query(`DROP TYPE "public"."moodOfDayEnum"`);
	}
}
