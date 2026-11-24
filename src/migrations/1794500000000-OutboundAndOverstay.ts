import type { MigrationInterface, QueryRunner } from 'typeorm';

export class OutboundAndOverstay1794500000000 implements MigrationInterface {
    name = 'OutboundAndOverstay1794500000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // the warehouse that holds goods left after the end date; never bookable
        await queryRunner.query(
            `ALTER TABLE "warehouses" ADD "overstay" boolean NOT NULL DEFAULT false`
        );
        // the moment the goods left the warehouse
        await queryRunner.query(
            `ALTER TABLE "bookings" ADD "releasedAt" TIMESTAMP`
        );
        await queryRunner.query(
            `ALTER TABLE "invoices" ADD "overstay" boolean NOT NULL DEFAULT false`
        );
        await queryRunner.query(
            `ALTER TABLE "config" ADD "overstayMultiplier" numeric(18,2) NOT NULL DEFAULT 1.5`
        );

        // Seed the overstay warehouse once, inactive so nobody can book into it.
        await queryRunner.query(
            `INSERT INTO "warehouses" ("country", "city", "address", "active", "overstay")
             SELECT 'Magyarország', 'Győr', 'Túltárolási raktár', false, true
             WHERE NOT EXISTS (SELECT 1 FROM "warehouses" WHERE "overstay" = true)`
        );
        await queryRunner.query(
            `INSERT INTO "shelfs" ("capacity", "type", "status", "warehouseId")
             SELECT shelf.capacity, shelf.type::"shelfs_type_enum", 'unused', w."id"
             FROM "warehouses" w
             CROSS JOIN (VALUES (25, 'none'), (25, 'none'), (25, 'none'), (25, 'none'),
                                (25, 'refrigerated'), (25, 'refrigerated'))
                  AS shelf(capacity, type)
             WHERE w."overstay" = true
               AND NOT EXISTS (SELECT 1 FROM "shelfs" s WHERE s."warehouseId" = w."id")`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "warehouses" WHERE "overstay" = true`
        );
        await queryRunner.query(
            `ALTER TABLE "config" DROP COLUMN "overstayMultiplier"`
        );
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "overstay"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "releasedAt"`);
        await queryRunner.query(
            `ALTER TABLE "warehouses" DROP COLUMN "overstay"`
        );
    }
}
