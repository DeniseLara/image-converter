import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());

  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
  app.enableCors({
    origin: frontendUrl,
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port); 
}
bootstrap();
