import { MigrationInterface, QueryRunner } from "npm:typeorm";

export class Booze1728068686562 implements MigrationInterface {
    name = 'Booze1728068686562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."boozeQuantityEnum" AS ENUM('low', 'medium', 'high')`);
        await queryRunner.query(`CREATE TABLE "booze" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "quantity" "public"."boozeQuantityEnum", CONSTRAINT "PK_11552d64c77396c04f8fadc2f66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booze" ADD CONSTRAINT "FK_5a3089421a05a4bbd6601da1f57" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booze" DROP CONSTRAINT "FK_5a3089421a05a4bbd6601da1f57"`);
        await queryRunner.query(`DROP TABLE "booze"`);
        await queryRunner.query(`DROP TYPE "public"."boozeQuantityEnum"`);
    }

}
