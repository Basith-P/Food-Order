import { IsEmail, Length } from "class-validator";

export class CreateCustomerInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;

  @Length(6, 12)
  phone: string;
}
