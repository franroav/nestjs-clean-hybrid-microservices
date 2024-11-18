import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from '../../../../application/src/dto/auth/create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
