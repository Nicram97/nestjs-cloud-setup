import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1642169579428 implements MigrationInterface {
    name = 'migration1642169579428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userName" varchar NOT NULL, "description" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
