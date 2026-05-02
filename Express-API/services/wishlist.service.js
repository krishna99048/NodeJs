const wishlistModel = require("../models/wishlist.model")

// add items into wishlist
module.exports.AddToWishlist = async ({ userId, item }) => {
    let wishlist = await wishlistModel.findOne({ userId });
    
    if(!wishlist){
        wishlist = new wishlistModel({ userId, productIds: [] });
    }
    
    // Convert item to string if it's an object or just use as is
    const productId = item.productId || item;
    
    if (!wishlist.productIds.includes(productId)) {
        wishlist.productIds.push(productId);
    }
    return await wishlist.save();
};

// get wishlist
module.exports.GetWishlist = async (userId) => {
    return await wishlistModel.findOne({ userId });
};

// remove from wishlist
module.exports.RemoveFromWishlist = async ({ userId, productId }) => {
    return await wishlistModel.findOneAndUpdate(
        { userId },
        { $pull: { productIds: productId } },
        { new: true }
    );
};