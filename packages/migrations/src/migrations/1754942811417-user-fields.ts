import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFields1754942811417 implements MigrationInterface {
    name = 'AddUserFields1754942811417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_users_email"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_username"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "emailConfirmed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" varchar(20) NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_username" ON "users" ("username")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_users_email"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_username"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailConfirmed"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_username" ON "users" ("username")`);
    }

}
