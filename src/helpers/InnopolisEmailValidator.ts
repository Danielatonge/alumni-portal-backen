import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';


@ValidatorConstraint({ name: 'innopolisEmailValidator', async: false })
export class InnopolisEmailValidator implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return validateEmail(text)
    }

    defaultMessage(args: ValidationArguments) {
        return 'You can register only with Innopolis email address';
    }
}

export const validateEmail = (text: string) =>
    text.endsWith('@innopolis.university') || text.endsWith('@innopolis.ru');