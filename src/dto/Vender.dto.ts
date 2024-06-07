export interface CreateVenderInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface EditVendorInputs {
  name?: string;
  address?: string;
  phone?: string;
  foodType?: [string];
}

export interface VenderLoginInput {
  email: string;
  password: string;
}

export interface VenderPayload {
  _id: string;
  name: string;
  email: string;
  foodType: [string];
}

export interface CreateOfferInputs {
  type: string;
  title: string;
  desc: string;
  discount: number;
  minVal: number;
  startDate: Date;
  endDate: Date;
  promoCode: string;
  promoType: string;
  bank?: [string];
  bins?: [number];
  pincode?: [string];
}
