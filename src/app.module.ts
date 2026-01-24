import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { HomeworksModule } from './homeworks/homeworks.module';
import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';
import { RatingsModule } from './ratings/ratings.module';
import { SmsModule } from './sms/sms.module';
import { AdminModule } from './admin/admin.module';
import { VerificationModule } from './verification/verification.module';
import { MyModule } from './my/my.module';
import { CourseCategoryModule } from './course-category/course-category.module';
import { PurchasedCoursesModule } from './purchased-courses/purchased-courses.module';
import { ContactModule } from './contact/contact.module';
import { PaymentModule } from './payment/payment.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    PrismaModule,
    SmsModule,
    AdminModule,
    VerificationModule,
    MyModule,
    CourseCategoryModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    LessonsModule,
    HomeworksModule,
    ExamsModule,
    QuestionsModule,
    RatingsModule,
    PurchasedCoursesModule,
    ContactModule,
    PaymentModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
