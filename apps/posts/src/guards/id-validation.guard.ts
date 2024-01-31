import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Types } from 'mongoose';
import { IdType } from './types/id-type.enum';

@Injectable()
export class IdValidationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const idTypes: IdType[] = [
      IdType.COMMENT_ID,
      IdType.POST_ID,
      IdType.USER_ID,
      IdType.ID,
    ];

    for (const idType of idTypes) {
      const id = request.params[idType];

      if (id && !Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`${id} is not a valid ${idType}`);
      }
    }

    return true;
  }
}
