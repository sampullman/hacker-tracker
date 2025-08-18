import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddEmailConfirmation1755419252320 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "email_confirmations",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "userId",
                        type: "uuid"
                    },
                    {
                        name: "code",
                        type: "varchar",
                        length: "6"
                    },
                    {
                        name: "expiresAt",
                        type: "timestamptz"
                    },
                    {
                        name: "used",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "createdAt",
                        type: "timestamptz",
                        default: "CURRENT_TIMESTAMP"
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["userId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        onDelete: "CASCADE"
                    }
                ]
            }),
            true
        );

        await queryRunner.query(
            `CREATE INDEX "IDX_email_confirmations_userId_code" ON "email_confirmations" ("userId", "code")`
        );

        await queryRunner.query(
            `CREATE INDEX "IDX_email_confirmations_expiresAt" ON "email_confirmations" ("expiresAt")`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("email_confirmations", "IDX_email_confirmations_expiresAt");
        await queryRunner.dropIndex("email_confirmations", "IDX_email_confirmations_userId_code");
        await queryRunner.dropTable("email_confirmations");
    }

}