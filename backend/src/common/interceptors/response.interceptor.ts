import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        if (data && typeof data === 'object' && 'statusCode' in data) {
          return data;
        }

        const message =
          (data && typeof data === 'object' && data.message) || 'Success';

        const responseData =
          data && typeof data === 'object' && 'data' in data ? data.data : data;

        const meta =
          data && typeof data === 'object' && 'meta' in data
            ? data.meta
            : undefined;

        return {
          statusCode,
          message,
          data: responseData,
          ...(meta && { meta }),
        };
      }),
    );
  }
}
