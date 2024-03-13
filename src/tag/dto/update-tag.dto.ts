import { PartialType } from '@nestjs/swagger';
import { CreateTagDto } from './tag.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {}
