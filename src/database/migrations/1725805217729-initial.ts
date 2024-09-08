import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class Initial1725805217729 implements MigrationInterface {
  name = 'Initial1725805217729';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."sleepsTypeEnum" AS ENUM('go_to_bed', 'wake_up')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sleeps" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "type" "public"."sleepsTypeEnum" NOT NULL, CONSTRAINT "PK_c1ebe5a0cb506e527ea1677838d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tgId" character varying NOT NULL, "username" character varying, "firstName" character varying, "lastName" character varying, "language" character varying, "isAllowed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sleeps" ADD CONSTRAINT "FK_2aa67c9d5640fca642170770f86" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sleeps" DROP CONSTRAINT "FK_2aa67c9d5640fca642170770f86"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "sleeps"`);
    await queryRunner.query(`DROP TYPE "public"."sleepsTypeEnum"`);
  }
}
