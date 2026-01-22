import { Module, Global } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';

@Global()
@Module({
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
