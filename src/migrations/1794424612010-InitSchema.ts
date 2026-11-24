import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1794424612010 implements MigrationInterface {
    name = 'InitSchema1794424612010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "balance" numeric(18,2) NOT NULL DEFAULT '0', "userId" uuid, CONSTRAINT "REL_2ecdb33f23e9a6fc392025c0b9" UNIQUE ("userId"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying(50), "city" character varying(50), "address" character varying(120), "postalCode" integer, "bankAccountNumber" character varying(34), "userId" uuid, CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'warehouseman', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warehouses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying(255) NOT NULL, "city" character varying(255) NOT NULL, "address" character varying(255) NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_56ae21ee2432b2270b48867e4be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."shelfs_type_enum" AS ENUM('none', 'refrigerated')`);
        await queryRunner.query(`CREATE TYPE "public"."shelfs_status_enum" AS ENUM('unused', 'inactive', 'active')`);
        await queryRunner.query(`CREATE TABLE "shelfs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "capacity" integer NOT NULL, "type" "public"."shelfs_type_enum" NOT NULL DEFAULT 'none', "status" "public"."shelfs_status_enum" NOT NULL DEFAULT 'unused', "warehouseId" uuid NOT NULL, CONSTRAINT "PK_e1cac34106c17471773ae78553a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unitPrice" integer NOT NULL, "refrigeratedMultiplier" numeric(18,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_d0ee79a681413d50b0a4f98cf7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shelfs" ADD CONSTRAINT "FK_4dc819f93d754c1f3fbb0b1fb67" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shelfs" DROP CONSTRAINT "FK_4dc819f93d754c1f3fbb0b1fb67"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97"`);
        await queryRunner.query(`DROP TABLE "config"`);
        await queryRunner.query(`DROP TABLE "shelfs"`);
        await queryRunner.query(`DROP TYPE "public"."shelfs_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."shelfs_type_enum"`);
        await queryRunner.query(`DROP TABLE "warehouses"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
    }

}
