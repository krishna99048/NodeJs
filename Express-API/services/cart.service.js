const cartModel = require("../models/cart.model");

// add items
module.exports.addToCart =async ({userId , items}) => {
    const cart = await cartModel.findOne({userId});

    if (!cart) {
        return new cartModel({userId , items : []})
    }

    cart.items.push(item);
    return await cart.save();
}