import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // app module 실행해준다
  const app = await NestFactory.create(AppModule);
  // 3000번 포트 요청을 대기하고 있다
  await app.listen(3001);
}
bootstrap();
