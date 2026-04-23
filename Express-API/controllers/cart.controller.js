const  cartService = require("../services/cart.service");


module.exports.AddToCart = async (req , res) => {
    try {
        const userId = req.user.id;
        const {item} = req.body;
        const cart = await cartService.addToCart({userId , item});

        return res.status(200).json({message: "Add Items To Cart Successfully" , cart})
    }
    catch (error) {
        return res.status(400).json({message : ErrorEvent.message})
    }
}