const cartModel = require("../models/cart.model");

// add items
module.exports.addToCart =async ({userId , item}) => {
    let cart = await cartModel.findOne({userId});

    if (!cart) {
        cart = new cartModel({userId , items : []})
    }

    cart.items.push(item);
    return await cart.save();
}

// get all cart
module.exports.GetCart = async (userId) => {
    return await cartModel.findOne({userId});
};

// Delete Single Product
// remove single product from cart
module.exports.RemoveSingleProduct = async ({ userId, productId }) => {
    
    // find login user cart
    let cart = await cartModel.findOne({ userId });
    if(!cart){
        throw new Error("Cart Not Found!!");
    }

    // find index number of product based on productId
    const itemIndex = cart.items.findIndex( (i) => i.productId.equals(productId), 
        // console.log(i);
        // // i => that give items array
        // return i.productId.toString() === productId ;
    );

    console.log(itemIndex);
    
    if(itemIndex < 0){
        throw new Error("Item Not Found!!");
    }

    cart.items.splice(itemIndex, 1);
    return await cart.save();
};