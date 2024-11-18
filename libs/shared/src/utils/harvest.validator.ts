import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "customText", async: false })
export class HarvestValidator implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
         // logic
        return false
    }

    defaultMessage(args: ValidationArguments) {
        return `Propiedad ${args.property} no es válido o formato incorrecto!`;
    }
}