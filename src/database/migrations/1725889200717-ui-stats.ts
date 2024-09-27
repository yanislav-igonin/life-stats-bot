import type { MigrationInterface, QueryRunner } from "typeorm";

export class UiStats1725889200717 implements MigrationInterface {
	name = "UiStats1725889200717";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ADD "token" character varying`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token"`);
	}
}
