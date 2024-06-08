import { Request, Response } from "express";
import Vender from "../models/Vender";
import Food from "../models/Food";
import Offer from "../models/Offer";

export const getFoodAvailability = async (req: Request, res: Response) => {
  const pincode = req.params.pincode;

  const vendors = await Vender.find({ pincode, isServiceAvailable: true })
    .sort({ rating: -1 })
    .limit(10)
    .populate("foods");

  return res.status(200).json({ data: vendors });
};

export const getTopRestaurants = async (req: Request, res: Response) => {
  const pincode = req.params.pincode;

  const vendors = await Vender.find({ pincode, isServiceAvailable: true })
    .sort({ rating: -1 })
    .limit(2);

  return res.status(200).json({ data: vendors });
};

export const getFoodIn30min = async (req: Request, res: Response) => {
  const pincode = req.params.pincode;

  // const result = await Vender.find({ pincode, isServiceAvailable: true }).populate({
  //   path: "foods",
  //   match: { readyTime: { $lte: 30 } },
  // });

  const result = await Food.find({ readyTime: { $lte: 30 } }).populate("venderId");

  return res.status(200).json({ data: result });
};

export const searchFoods = async (req: Request, res: Response) => {
  const { query } = req.query;

  const result = await Food.find({ name: { $regex: query, $options: "i" } }).populate(
    "venderId"
  );

  return res.status(200).json({ data: result });
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await Vender.findById(id).populate("foods");

  return res.status(200).json({ data: result });
};

export const getOffersAtPincode = async (req: Request, res: Response) => {
  const pincode = req.params.pincode;

  // offer model has pincode field which is an array of strings.
  // we need to get offers where pincode array contains the given pincode
  // or the pincode array is empty
  const result = await Offer.find({
    $or: [{ pincode: { $in: [pincode] } }, { pincode: { $size: 0 } }],
  });

  return res.status(200).json({ data: result });
};
