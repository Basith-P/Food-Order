import { plainToClass } from "class-transformer";
import {
  CartItem,
  CreateCustomerInputs,
  CreateOrderInputs,
  CustomerLginInputs,
  EditCustomerInputs,
} from "../dto";
import { Request, Response, Router } from "express";
import { validate } from "class-validator";
import {
  encryptPassword,
  generateOTP,
  generateSalt,
  generateToken,
  onRequestOTP,
  validatePassword,
} from "../utils";
import Customer from "../models/Customer";
import Food from "../models/Food";
import Order from "../models/Order";
import Offer from "../models/Offer";
import Transaction from "../models/Transaction";
import Vender from "../models/Vender";
import DeliveryUser from "../models/DeliveryUser";

export const customerSignup = async (req: Request, res: Response) => {
  const inputs = plainToClass(CreateCustomerInputs, req.body);
  const errors = await validate(inputs, { validationError: { target: false } });
  if (errors.length > 0) return res.status(400).json(errors);

  const { email, password, phone } = inputs;

  const customer = await Customer.findOne({ email });
  if (customer) return res.status(400).json({ msg: "Email already exists" });

  const salt = await generateSalt();
  const passwordHash = await encryptPassword(password, salt);

  const { otp, otpExpires } = generateOTP();

  const result = await Customer.create({
    email,
    password: passwordHash,
    phone,
    salt,
    otp,
    otpExpires,
    firstName: "",
    lastName: "",
  });

  if (!result)
    return res.status(500).json({ msg: "Failed to create customer" });

  await onRequestOTP(otp, phone);

  const token = generateToken({
    _id: result.id.toString(),
    email: result.email,
    isVerified: result.isVeified,
  });

  return res.json({ token, isVerified: result.isVeified, email: result.email });
};

export const customerSignin = async (req: Request, res: Response) => {
  const loginInputs = plainToClass(CustomerLginInputs, req.body);
  const errors = await validate(loginInputs, {
    validationError: { target: false },
  });
  if (errors.length > 0) return res.status(400).json(errors);

  const { email, password } = loginInputs;

  const customer = await Customer.findOne({ email });
  if (!customer)
    return res.status(400).json({ msg: "Invalid email or password" });

  const isValid = await validatePassword(
    password,
    customer.password,
    customer.salt
  );
  if (!isValid)
    return res.status(400).json({ msg: "Invalid email or password" });

  const token = generateToken({
    _id: customer.id.toString(),
    email: customer.email,
    isVerified: customer.isVeified,
  });

  return res.json({
    token,
    isVerified: customer.isVeified,
    email: customer.email,
  });
};

export const customerVerify = async (req: Request, res: Response) => {
  const { otp } = req.body;
  const customer = req.user;

  if (!customer) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(customer._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  if (profile.otp !== parseInt(otp))
    return res.status(400).json({ msg: "Invalid OTP" });
  if (profile.otpExpires < new Date())
    return res.status(400).json({ msg: "OTP expired" });

  profile.isVeified = true;
  await profile.save();

  return res.json({ msg: "Customer verified" });
};

export const requestOTP = async (req: Request, res: Response) => {
  const customer = req.user;
  if (!customer) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(customer._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  const { otp, otpExpires } = generateOTP();
  profile.otp = otp;
  profile.otpExpires = otpExpires;
  await profile.save();

  await onRequestOTP(otp, profile.phone);

  return res.json({ msg: "OTP sent" });
};

export const getCustomerProfile = async (req: Request, res: Response) => {
  const customer = req.user;
  if (!customer) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(customer._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  return res.json({ data: profile });
};

export const editCustomerProfile = async (req: Request, res: Response) => {
  const profileInputs = plainToClass(EditCustomerInputs, req.body);
  const errors = await validate(profileInputs, {
    validationError: { target: false },
  });
  if (errors.length > 0) return res.status(400).json(errors);

  const customer = req.user;
  if (!customer) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(customer._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  const { firstName, lastName, address } = profileInputs;

  if (firstName) profile.firstName = firstName;
  if (lastName) profile.lastName = lastName;
  if (address) profile.address = address;

  const result = await profile.save();

  return res.json({ data: result, msg: "Profile updated" });
};

// CART

export const addToCart = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  let { id, units } = <CartItem>req.body;
  if (!id || !units) return res.status(400).json({ msg: "Invalid request" });

  const food = await Food.findById(id);
  if (!food) return res.status(404).json({ msg: "Food not found" });

  const profile = await Customer.findById(user._id).populate("cart.food");
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  let cartItems = profile.cart;

  const index = cartItems.findIndex((item) => item.food._id.toString() === id);
  if (index === -1) {
    cartItems.push({ food: id, units: units });
  } else {
    cartItems[index].units += units;
    if (cartItems[index].units < 1) cartItems.splice(index, 1); // remove item from cart
  }

  profile.cart = cartItems;
  await profile.save();

  return res.json({ msg: "Cart updated", data: profile.cart });
};

export const getCart = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(user._id).populate("cart.food");
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  return res.json({ data: profile.cart });
};

export const clearCart = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(user._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  profile.cart = [];
  await profile.save();

  return res.json({ msg: "Cart cleared" });
};

// OFFERS

export const veifyOffer = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(user._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  const offerId = req.params.id;
  if (!offerId) return res.status(400).json({ msg: "Invalid offer" });

  const offer = await Offer.findById(offerId);
  if (!offer) return res.status(404).json({ msg: "Offer not found" });

  if (offer.endDate < new Date())
    return res.status(400).json({ msg: "Offer expired" });
  if (!offer.isActive) return res.status(400).json({ msg: "Offer not active" });

  return res.json({ data: offer });
};

// PAYMENT

export const createPayment = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(user._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  const { amount, mode, offerId } = req.body;
  let payble = Number(amount);

  if (offerId) {
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ msg: "Offer not found" });

    if (offer.endDate < new Date())
      return res.status(400).json({ msg: "Offer expired" });
    if (!offer.isActive)
      return res.status(400).json({ msg: "Offer not active" });
    if (offer.minVal > payble)
      return res.status(400).json({ msg: "Minimum amount not met" });

    payble = payble - offer.discount;
  }

  // payment gateway integration

  // -----------------------------

  const txn = await Transaction.create({
    customer: profile.id,
    vendor: "",
    order: "",
    amount: payble,
    offerUsed: offerId,
    status: "success",
    payMode: mode,
    payResponse: "",
  });
  if (!txn)
    return res.status(500).json({ msg: "Failed to create transaction" });

  return res.json({ data: txn });
};

// ORDERS

export const getOrders = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(user._id).populate("orders");
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  return res.json({ data: profile.orders });
};

const assignOrderForDelivery = async (orderId: string, venderId: string) => {
  const vendor = await Vender.findById(venderId);
  if (!vendor) throw new Error("Vendor not found");

  const deliveryUsers = await DeliveryUser.find({
    pincode: vendor.pincode,
    isAvailable: true,
    isVeified: true,
  });
  if (deliveryUsers.length === 0) throw new Error("No delivery user available");

  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  // Find nearest delivery user
  const deliveryUser = deliveryUsers[0];
  order.deliveryId = deliveryUser.id;
  await order.save();

};

const validateTxn = async (txnId: string) => {
  const txn = await Transaction.findById(txnId);
  if (!txn || txn.status === "FAILED") return null;
  return txn;
};

export const createOrder = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(user._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  const { txnId, amount, items } = <CreateOrderInputs>req.body;

  const txn = await validateTxn(txnId);
  if (!txn) return res.status(400).json({ msg: "Invalid transaction" });

  let cartItems = [];
  let total = 0;

  const foods = await Food.find({ _id: { $in: items.map((item) => item.id) } });
  if (foods.length !== items.length)
    return res.status(400).json({ msg: "Invalid food item" });

  for (let i = 0; i < items.length; i++) {
    const food = foods.find((item) => item.id === items[i].id);
    if (!food) return res.status(400).json({ msg: "Invalid food item" });

    total += food.price * items[i].units;
    cartItems.push({
      food: food.id,
      units: items[i].units,
    });
  }

  const order = await Order.create({
    items: cartItems,
    total,
    customer: profile.id,
    payMethod: "cash",
    payResponse: "",
    paidAmount: amount,
    vendor: foods[0].venderId,
  });
  if (!order) return res.status(500).json({ msg: "Failed to create order" });

  profile.orders.push(order.id);
  await profile.save();

  txn.order = order.id;
  txn.vendor = foods[0].venderId;
  txn.customer = profile.id;
  txn.status = "SUCCESS";
  await txn.save();

  return res.json({ data: order });
};

export const getOrderById = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const profile = await Customer.findById(user._id);
  if (!profile) return res.status(404).json({ msg: "Customer not found" });

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ msg: "Order not found" });

  return res.json({ data: order });
};
