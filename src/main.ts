import * as dotenv from 'dotenv';
dotenv.config(); 

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";


async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule)

    // Настройка CORS
    app.use((req, res, next) => {
        console.log(`Request: ${req.method} ${req.url}`);
        console.log('Origin:', req.headers.origin);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', '*');
        
        if (req.method === 'OPTIONS') {
            return res.sendStatus(204);
        }
        next();
    });
    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));

}

start()