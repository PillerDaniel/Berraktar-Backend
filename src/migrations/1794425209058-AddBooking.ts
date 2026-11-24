import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBooking1794425209058 implements MigrationInterface {
    name = 'AddBooking1794425209058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "booking_shelfs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookingId" uuid NOT NULL, "shelfId" uuid NOT NULL, "assignedPallets" integer NOT NULL, CONSTRAINT "PK_b86fd7a9dcdf2d4b8c549560153" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."invoices_status_enum" AS ENUM('pending', 'paid', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "invoices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookingId" uuid NOT NULL, "userId" uuid NOT NULL, "amount" integer NOT NULL, "status" "public"."invoices_status_enum" NOT NULL DEFAULT 'pending', "issuedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending', 'stored', 'closed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "totalPallets" integer NOT NULL, "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking_shelfs" ADD CONSTRAINT "FK_785f92423309552e45809ee2e4e" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_shelfs" ADD CONSTRAINT "FK_69c654194cbd29a127791954392" FOREIGN KEY ("shelfId") REFERENCES "shelfs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_eca01fda44679cc1c342822e01b" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_fcbe490dc37a1abf68f19c5ccb9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_38a69a58a323647f2e75eb994de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        // Pricing is required for bookings; seed the planned defaults once.
        await queryRunner.query(`INSERT INTO "config" ("unitPrice", "refrigeratedMultiplier") SELECT 1000, 1.25 WHERE NOT EXISTS (SELECT 1 FROM "config")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_38a69a58a323647f2e75eb994de"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_fcbe490dc37a1abf68f19c5ccb9"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_eca01fda44679cc1c342822e01b"`);
        await queryRunner.query(`ALTER TABLE "booking_shelfs" DROP CONSTRAINT "FK_69c654194cbd29a127791954392"`);
        await queryRunner.query(`ALTER TABLE "booking_shelfs" DROP CONSTRAINT "FK_785f92423309552e45809ee2e4e"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TYPE "public"."invoices_status_enum"`);
        await queryRunner.query(`DROP TABLE "booking_shelfs"`);
    }

}
