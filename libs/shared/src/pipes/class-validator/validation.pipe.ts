import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Utils } from "../../utils/utils.helper";
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    // validate DTO's errors
    if (errors.length > 0) {
      const message: any = Utils.dtoValidationErrorMessage(errors);
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
      //throw new BadRequestException(message);
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
