const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware")
const cartController = require("../../../controllers/cart.controller")

// add items
router.post("/add" , userMiddleware.authUser , cartController.AddToCart); 

// get all items
router.get("/all" , userMiddleware.authUser , cartController.GetCart)

// remove single items from cart
router.delete("/product/:id"  , userMiddleware.authUser , cartController.RemoveItem)

// remove all items from cart --> empty cart

module.exports = router ;