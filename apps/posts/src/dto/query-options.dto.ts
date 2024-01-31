import { IsOptional, IsNumber, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryOptionsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;
}
