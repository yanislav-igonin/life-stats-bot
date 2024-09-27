import { type MigrationInterface, type QueryRunner } from "typeorm";

export class SleepQualityMoreOptions1725970497189
	implements MigrationInterface
{
	name = "SleepQualityMoreOptions1725970497189";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TYPE "public"."sleepsQualityEnum" RENAME TO "sleepsQualityEnum_old"`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."sleepsQualityEnum" AS ENUM('very_bad', 'bad', 'meh', 'good', 'very_good')`,
		);
		await queryRunner.query(
			`ALTER TABLE "sleeps" ALTER COLUMN "quality" TYPE "public"."sleepsQualityEnum" USING "quality"::"text"::"public"."sleepsQualityEnum"`,
		);
		await queryRunner.query(`DROP TYPE "public"."sleepsQualityEnum_old"`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."sleepsQualityEnum_old" AS ENUM('bad', 'meh', 'good')`,
		);
		await queryRunner.query(
			`ALTER TABLE "sleeps" ALTER COLUMN "quality" TYPE "public"."sleepsQualityEnum_old" USING "quality"::"text"::"public"."sleepsQualityEnum_old"`,
		);
		await queryRunner.query(`DROP TYPE "public"."sleepsQualityEnum"`);
		await queryRunner.query(
			`ALTER TYPE "public"."sleepsQualityEnum_old" RENAME TO "sleepsQualityEnum"`,
		);
	}
}
