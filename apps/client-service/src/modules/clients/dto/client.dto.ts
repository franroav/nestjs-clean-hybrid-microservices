import { IsString } from 'class-validator';

export class CreateClientDto {
    @IsString()
    dni: string;

    @IsString()
    email: string;

    @IsString()
    commerceUserId: string;

    @IsString()
    app: string;
}

export class UpdateClientDto {
    @IsString()
    dni?: string;

    @IsString()
    email?: string;

    @IsString()
    commerceUserId?: string;

    @IsString()
    app?: string;
}
