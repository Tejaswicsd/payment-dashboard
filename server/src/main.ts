import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// ✅ Force data-source.ts to be compiled into dist/
import './data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // ✅ CORS fix for frontend
 app.enableCors({
  origin: 'http://localhost:19006', // or your web frontend URL
});


  await app.listen(3000);
}
bootstrap();
