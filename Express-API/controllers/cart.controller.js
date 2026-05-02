const cartModel = require("../models/cart.model");
const cartService = require("../services/cart.service");

// Add To Cart
module.exports.AddToCart = async (req,res) =>{
    try {
        const userId = req.user.id;
        const {item} = req.body;
       
        let cart = await cartModel.findOne({userId});

        if (cart) {
            const isExist = cart.items.some(val => val.productId.toString() === item.productId);
            if (isExist) {
                return res.status(400).json({message : "Product already in cart"});
            }
        }

        cart = await cartService.addToCart({userId, item});
        return res.status(200).json({message: "Item added to cart successfully", cart});
    } 
    catch (error) {
        return res.status(400).json({message: error.message});
    }
}

// get Cart
module.exports.GetCart = async (req , res) => {
    try {
        const userId = req.user.id;

        let cart = await cartService.GetCart(userId);

        if (!cart) {
            return res.status(200).json({message : "Cart is empty" , cart: { items: [] }});
        }

        return res.status(200).json({message : "Cart Data Fetch Successfully" , cart});

    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}

// Remove single item from  cart
module.exports.RemoveItem = async (req , res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        const cart = await cartService.RemoveSingleProduct({userId, productId});

        if (!cart) return res.status(404).json({message: "Product Not Found"});
        
        return res.status(200).json({message: "Remove Items From Cart Successfully", cart});

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}