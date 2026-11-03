import 'reflect-metadata';
import express from 'express';
import type { Application } from 'express';
import type { Request, Response } from 'express';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './application/utils/ConnectDB.js';
import { connectRedis } from './application/utils/ConnectRedis.js';

//route imports
import authRouter from './api/routes/AuthRouter.js';

//middleware imports

//function imports

//APP
const PORT: number = config.get('Server.PORT') as number;
const app: Application = express();

//CORS
const corsOptions: cors.CorsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

//START
const startServer = async () => {
    await connectDB();
    await connectRedis(process.env.REDIS_URL!);

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());

    //routes
    app.use('/api/auth', authRouter);

    app.get('/api', (req: Request, res: Response) => {
        res.send('API running');
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
