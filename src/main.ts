import * as dotenv from 'dotenv';
dotenv.config(); 

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";


async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule, {
        cors: true
    })

    // Настройка CORS
   app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    exposedHeaders: '*',
    credentials: false,
    maxAge: 3600,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    });
    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));

}

start()