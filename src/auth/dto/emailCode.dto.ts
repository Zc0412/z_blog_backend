import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailCodeDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
