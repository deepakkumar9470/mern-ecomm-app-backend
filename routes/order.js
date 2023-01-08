import express from "express";
const router = express.Router()

import {  getAllOrders, placeOrder, updateOrder } from '../controllers/orderController.js'

import { isAdmin } from "../middleware/auth-middleware.js";



// @ /api/orders
router.post('/', placeOrder)

// @ /api/orders
router.get('/',isAdmin, getAllOrders)



// @ /api/orders
router.get('/:id',isAdmin, updateOrder)




export default router