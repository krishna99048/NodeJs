const express = require('express');
const router = express.Router();
// const middleware = require("../../../middlewares/user.middleware")
const middleware = require("../../../middlewares/admin.middleware")
const usermiddleware = require("..//../../middlewares/user.middleware")
const adminController = require("../../../controllers/admin.controller")


// show all users
// login user --> check user is Admin? --> show all users
router.get("/all/user" ,usermiddleware.authUser, middleware.authAdmin , adminController.AllUser)


router.delete("/user/:id", usermiddleware.authUser,middleware.authAdmin , adminController.deleteUser)

// Update role -- create manager
// Router -- Service -- Controller -- Call into router
router.put("/user/:id/role" , usermiddleware.authUser,middleware.authAdmin , adminController.updateUserRole)

// show all orders
router.get("/all/orders" , usermiddleware.authUser, middleware.authAdmin, adminController.AllOrders)

// show all carts
router.get("/all/carts" , usermiddleware.authUser, middleware.authAdmin, adminController.AllCarts)

// show all wishlists
router.get("/all/wishlists" , usermiddleware.authUser, middleware.authAdmin, adminController.AllWishlists)

module.exports = router;