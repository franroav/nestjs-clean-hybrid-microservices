import { PartialType } from '@nestjs/mapped-types';
import { CreateAgricultoreDto } from './create-agricultore.dto';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAgricultoreDto extends PartialType(CreateAgricultoreDto) {
    @ApiProperty()
    @IsOptional()
    @IsString()
    nombre?: string;


    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email?: string;
  }
