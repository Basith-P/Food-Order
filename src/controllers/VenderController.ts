import { Request, Response, NextFunction } from "express";
import { findVender } from "./AdminController";
import { generateToken, validatePassword } from "../utils/PasswordUtility";
import { CreateFoodInput, CreateOfferInputs, EditVendorInputs } from "../dto";
import Food from "../models/Food";
import Order from "../models/Order";
import Offer from "../models/Offer";

export const venderLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const vendor = await findVender("", email);
  if (vendor == null)
    return res.status(401).json({ msg: "Vender with this email does not exist" });

  const isValid = await validatePassword(password, vendor.password, vendor.salt);

  if (!isValid) return res.status(401).json({ msg: "Invalid password" });

  const token = generateToken({
    _id: vendor.id,
    name: vendor.name,
    email: vendor.email,
    foodType: vendor.foodType,
  });

  // if (token == null) return res.status(500).json({ msg: "Something went wrong!" });

  return res.json({ token });
};

export const getVenderProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  return res.json({ data: vendor });
};

export const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const { address, phone, foodType, name } = <EditVendorInputs>req.body;

  if (address) vendor.address = address;
  if (phone) vendor.phone = phone;
  if (foodType) vendor.foodType = foodType;
  if (name) vendor.name = name;

  const result = await vendor.save();
  return res.json({ data: result, msg: "Profile updated" });
};

export const updateVendorCoverimages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const images = req.files as Express.Multer.File[];
  const imageNames = images.map((image) => image.filename);

  vendor.coverImages.push(...imageNames);

  const result = await vendor.save();
  return res.json({ data: result, msg: "Profile image updated" });
};

export const updateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const { isServiceAvailable } = req.body;

  vendor.isServiceAvailable = isServiceAvailable;

  const result = await vendor.save();
  return res.json({ data: result, msg: "Updated" });
};

export const addFood = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const { name, desc, category, foodType, readyTime, price } = <CreateFoodInput>req.body;

  const images = req.files as Express.Multer.File[];
  const imagePaths = images.map((image) => image.filename);

  const food = await Food.create({
    venderId: vendor.id,
    name,
    desc,
    category,
    foodType,
    readyTime,
    price,
    images: imagePaths,
  });

  if (vendor.foods == null) vendor.foods = [food.id];
  else vendor.foods.push(food.id);
  await vendor.save();

  return res.json({ data: food, msg: "Food added" });
};

export const getFoods = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const foods = await Food.find({ venderId: vendor.id });
  return res.json({ data: foods });
};

// ORDERS

export const getVendorOrders = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const orders = await Order.find({ vendor: vendor.id }).populate("items.food");

  return res.json({ data: orders });
};

export const getOrderDetails = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const order = await Order.findById(req.params.id).populate("items.food");

  if (order == null) return res.status(404).json({ msg: "Order not found" });

  return res.json({ data: order });
};

export const processOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const order = await Order.findById(req.params.id);
  if (order == null) return res.status(404).json({ msg: "Order not found" });

  const { status, remarks, time } = req.body;

  if (status) order.status = status;
  if (remarks) order.remarks = remarks;
  if (time) order.deliveryTime = time;

  const result = await order.save();
  return res.json({ data: result, msg: "Order updated" });
};

// OFFERS

export const createVendorOffer = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const {
    type,
    title,
    desc,
    discount,
    minVal,
    startDate,
    endDate,
    promoCode,
    promoType,
    bank,
    bins,
    pincode,
  } = <CreateOfferInputs>req.body;

  const offer = await Offer.create({
    type,
    vendors: [vendor.id],
    title,
    desc,
    discount,
    minVal,
    startDate,
    endDate,
    promoCode,
    promoType,
    bank,
    bins,
    pincode,
  });

  // if (vendor.offers == null) vendor.offers = [offer.id];
  // else vendor.offers.push(offer.id);

  // await vendor.save();

  return res.json({ data: offer, msg: "Offer created" });
};

export const getVendorOffers = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const offers = await Offer.find({ vendors: vendor.id });

  return res.json({ data: offers });
};

export const updateVendorOffer = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const offer = await Offer.findById(req.params.id);
  if (offer == null) return res.status(404).json({ msg: "Offer not found" });

  const {
    type,
    title,
    desc,
    discount,
    minVal,
    startDate,
    endDate,
    promoCode,
    promoType,
    bank,
    bins,
    pincode,
  } = <CreateOfferInputs>req.body;

  if (type) offer.type = type;
  if (title) offer.title = title;
  if (desc) offer.desc = desc;
  if (discount) offer.discount = discount;
  if (minVal) offer.minVal = minVal;
  if (startDate) offer.startDate = startDate;
  if (endDate) offer.endDate = endDate;
  if (promoCode) offer.promoCode = promoCode;
  if (promoType) offer.promoType = promoType;
  if (bank) offer.bank = bank;
  if (bins) offer.bins = bins;
  if (pincode) offer.pincode = pincode.map((p: string) => parseInt(p));

  const result = await offer.save();
  return res.json({ data: result, msg: "Offer updated" });
};

export const deleteVendorOffer = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ msg: "Unauthorized" });

  const vendor = await findVender(user._id);
  if (vendor == null) return res.status(404).json({ msg: "Vendor not found" });

  const offer = await Offer.findById(req.params.id);
  if (offer == null) return res.status(404).json({ msg: "Offer not found" });

  await offer.deleteOne();

  return res.json({ msg: "Offer deleted" });
};
