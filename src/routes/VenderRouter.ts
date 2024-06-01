import { Router, Request, Response } from "express";
import multer from "multer";

import {
  addFood,
  getFoods,
  getVenderProfile,
  updateVendorProfile,
  updateVendorService,
  venderLogin,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

// const imageFilter = (req: Request, file: any, cb: any) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/jpg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  // fileFilter: imageFilter,
}).array("images", 5);

router.post("/login", venderLogin);

router.use(authenticate);
router.route("/profile").get(getVenderProfile).patch(updateVendorProfile);
router.route("/services").patch(updateVendorService);

router
  .route("/foods")
  .get(getFoods)
  .post(
    (req, res, next) => {
      console.log(req.body);
      next();
    },
    upload,
    addFood
  );

router.get("/", (req: Request, res: Response) => {
  return res.send("Hello from Vender");
});

export { router as VenderRouter };
