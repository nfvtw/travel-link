import * as dotenv from 'dotenv';
dotenv.config(); 

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";


async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule)

    // Настройка CORS
    app.enableCors({
        origin: '*',                    // Для разработки — самое простое решение
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type', 
            'Authorization', 
            'X-Requested-With',
            'Accept',
            'Origin'
        ],
        credentials: false,             // Важно: при origin: '*' нельзя ставить true
        maxAge: 3600,                   // Кэшировать preflight запрос на 1 час
    });

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));

}

start()