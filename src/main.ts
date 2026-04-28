import * as dotenv from 'dotenv';
dotenv.config(); 

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cors from 'cors'


async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule)

    app.use(cors({
        credentials: true,
        origin: '*'
    }))
    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));

}

start()