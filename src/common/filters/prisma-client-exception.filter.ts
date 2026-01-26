import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': {
          const status = HttpStatus.CONFLICT;
          response.status(status).json({
            statusCode: status,
            message: `Unique constraint failed on the fields: ${exception.meta?.target}`,
            error: 'Conflict',
          });
          break;
        }
        case 'P2025': {
          const status = HttpStatus.NOT_FOUND;
          response.status(status).json({
            statusCode: status,
            message: exception.meta?.cause || 'Record not found',
            error: 'Not Found',
          });
          break;
        }
        case 'P2003': {
          const status = HttpStatus.BAD_REQUEST;
          response.status(status).json({
            statusCode: status,
            message: `Foreign key constraint failed on the field: ${exception.meta?.field_name}`,
            error: 'Bad Request',
          });
          break;
        }
        default:
          super.catch(exception, host);
          break;
      }
    } else {
      
      const status = HttpStatus.BAD_REQUEST;
      response.status(status).json({
        statusCode: status,
        message: exception.message.split('\n').pop()?.trim() || 'Validation error',
        error: 'Bad Request',
      });
    }
  }
}
