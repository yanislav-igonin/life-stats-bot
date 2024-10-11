import type { MigrationInterface, QueryRunner } from "npm:typeorm";

export class QualityOfSleep1725828830698 implements MigrationInterface {
	name = "QualityOfSleep1725828830698";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "sleeps" DROP COLUMN "type"`);
		await queryRunner.query(`DROP TYPE "public"."sleepsTypeEnum"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAllowed"`);
		await queryRunner.query(`ALTER TABLE "sleeps" ADD "wakeUpAt" TIMESTAMP`);
		await queryRunner.query(`ALTER TABLE "sleeps" ADD "goToBedAt" TIMESTAMP`);
		await queryRunner.query(
			`CREATE TYPE "public"."sleepsQualityEnum" AS ENUM('bad', 'meh', 'good')`,
		);
		await queryRunner.query(
			`ALTER TABLE "sleeps" ADD "quality" "public"."sleepsQualityEnum"`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "sleeps" DROP COLUMN "quality"`);
		await queryRunner.query(`DROP TYPE "public"."sleepsQualityEnum"`);
		await queryRunner.query(`ALTER TABLE "sleeps" DROP COLUMN "goToBedAt"`);
		await queryRunner.query(`ALTER TABLE "sleeps" DROP COLUMN "wakeUpAt"`);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "isAllowed" boolean NOT NULL DEFAULT false`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."sleepsTypeEnum" AS ENUM('go_to_bed', 'wake_up')`,
		);
		await queryRunner.query(
			`ALTER TABLE "sleeps" ADD "type" "public"."sleepsTypeEnum" NOT NULL`,
		);
	}
}
