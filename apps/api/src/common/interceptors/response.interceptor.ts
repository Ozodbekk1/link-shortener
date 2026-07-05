import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data: T) => {
        const response = data as Record<string, unknown>;

        if (
          response.data !== undefined &&
          typeof response.message === 'string'
        ) {
          return {
            success: true,
            // status: response.status,
            message: response.message,
            data: response.data,
          };
        }

        return {
          success: true,
          // status: response.status,
          message: 'Success',
          data,
        };
      }),
    );
  }
}
