import { IsEmail, Length } from "class-validator";

export class CreateDeliveryUserInputs {
  @IsEmail()
  email: string;

  @Length(6, 20)
  phone: string;

  @Length(6, 12)
  password: string;

  @Length(1, 16)
  firstName: string;

  @Length(1, 16)
  lastName: string;

  @Length(6, 16)
  address: string;

  @Length(6, 6)
  pincode: string;
}
