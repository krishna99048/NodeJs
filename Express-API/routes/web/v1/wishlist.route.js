const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware")
const wishlistController = require("../../../controllers/wishlist.controller")



// add into wishlist
router.post("/add" , userMiddleware.authUser , wishlistController.AddWishlist)


// get wishlist
router.get("/all", userMiddleware.authUser, wishlistController.GetWishlist);


// remove items from wishlist
router.delete("/product/:id", userMiddleware.authUser, wishlistController.RemoveWishlist);


module.exports = router