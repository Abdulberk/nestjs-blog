import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Types } from 'mongoose';

@Injectable()
export class PostIdValidationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Post id is not valid!');
    }

    return true;
  }
}
