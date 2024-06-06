import { IsEmail, Length } from "class-validator";

export class CreateCustomerInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;

  @Length(6, 16)
  phone: string;
}

export class CustomerLginInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class EditCustomerInputs {
  @Length(1, 16)
  firstName: string;

  @Length(1, 16)
  lastName: string;

  @Length(6, 16)
  address: string;
}

export class CreateOrderInputs {
  id: string;
  units: number;
}

export interface CustomerPaylod {
  _id: string;
  email: string;
  isVerified: boolean;
}
