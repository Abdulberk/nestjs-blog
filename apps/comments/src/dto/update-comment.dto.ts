import { AddCommentDto } from './add-comment.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCommentDto extends PartialType(AddCommentDto) {}
