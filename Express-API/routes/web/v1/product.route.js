// product creation
// product read single and all
// product update
// product delete

const express = require("express");
const userMiddleware = require("../../../middlewares/user.middleware")
const adminMiddleware = require("../../../middlewares/admin.middleware")
const productController = require("../../../controllers/product.controller")

const router = express.Router();


// create
router.post("/add", userMiddleware.authUser, adminMiddleware.authAdmin, productController.createProduct);

// authUser => it checks user is logged in or not => if logged in then => req.user(we get)
// authAdmin => req.user => checks role => admin or not => if admin then jump to next router

// all product
router.get("/all",  productController.allProduct);

// single product
router.get("/:id", productController.singleProduct);

// update product
router.put("/:id", userMiddleware.authUser, adminMiddleware.authAdmin, productController.updateProduct);

// delete product
router.delete("/:id", userMiddleware.authUser, adminMiddleware.authAdmin, productController.deleteProduct);

module.exports = router;
