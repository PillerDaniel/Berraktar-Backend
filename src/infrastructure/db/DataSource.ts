import { config as loadEnv } from 'dotenv';
import * as path from 'node:path';
import { DataSource } from 'typeorm';

import User from '../../domain/models/User.js';
import Wallet from '../../domain/models/Wallet.js';

loadEnv({
    path: path.resolve(process.cwd(), '../.env'),
});

const root = process.cwd();

export default new DataSource({
    type: 'postgres',

    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,

    synchronize: false,
    logging: false,

    entities: [User, Wallet],

    migrations: [path.join(root, 'src/migrations/**/*.{ts,js}')],
});
