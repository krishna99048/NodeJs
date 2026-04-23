const productModel = require("../models/product.model");

// create
module.exports.createProduct = async ({ name, description, stock, price, discount, isNewProduct, sku, images, brand, category }) => {
    if(!name || !description || !stock || !price || !sku || !images || !brand || !category){
        throw new Error ("All Fields Are Required!!");
    }

    let product = await productModel.create({
        name, 
        description, 
        stock, 
        price, 
        discount, 
        isNewProduct, 
        sku, 
        images, 
        brand, 
        category
    });
    return product;
};

// all product
module.exports.AllProduct = async () => {
    return await productModel.find();
};

// get single product
module.exports.singleProduct = async (id) => {
    const product = await productModel.findOne({ _id: id });
    return product;
};

// update product
module.exports.updateProduct = async (
    { 
        productId,         
        name, 
        description, 
        stock, 
        price, 
        discount, 
        isNewProduct, 
        sku, 
        images, 
        brand, 
        category 
    }
  ) => {
    const updatedProduct = await productModel.findOneAndUpdate(
        { _id: productId },
        {
            name, 
            description, 
            stock, 
            price, 
            discount, 
            isNewProduct, 
            sku, 
            images, 
            brand, 
            category
        },
        { new: true }
    );

    if(!updatedProduct){
        throw new Error("Product Not Found!!");
    }
    return updatedProduct;
};

// delete product
module.exports.deleteProduct = async (id) => {
    return await productModel.findOneAndDelete({ _id: id });
};

