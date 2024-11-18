import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import { join } from "path";

async function bootstrap() {
  // Load the .env file located in the apps/apps-service directory
  dotenv.config({ path: join(__dirname, "..", ".env") });

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
