import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotFoundFilter } from './middleware/NotFoundFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new NotFoundFilter());
  await app.listen(3000,'0.0.0.0');
}
bootstrap();
