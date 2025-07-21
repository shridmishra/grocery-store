import express from "express";
import { addProduct, changeStock, productById, productList } from "../controllers/productController.js";
import { upload } from "../configs/multer.js";
import authSeller from "../middleware/authSeller.js";

const productRouter = express.Router();

productRouter.get("/list",productList)
productRouter.get("/id",productById)
productRouter.get("/add", upload.array(["images" ]),authSeller,addProduct)
productRouter.get("/stock",authSeller,changeStock)

export default productRouter;