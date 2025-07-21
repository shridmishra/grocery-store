import express from 'express';
import authUser from '../middleware/authUser.js';
import { placeOrderCOD } from '../controllers/orderController.js';
import { getAllOrder, getUserOrder } from '../controllers/orderController.js';
import authSeller from '../middleware/authSeller.js';
const orderRouter = express.Router();


orderRouter.post('/cod',authUser, placeOrderCOD);
orderRouter.post("/user",authUser,getUserOrder  );
orderRouter.post("/seller",authSeller,getAllOrder)

export default orderRouter;