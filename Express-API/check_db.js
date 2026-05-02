
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ecommerce";

async function checkData() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    // Try to find products
    const products = await mongoose.connection.db.collection("products").find({}).toArray();
    console.log("Product count:", products.length);
    if (products.length > 0) {
      console.log("Sample product:", JSON.stringify(products[0], null, 2));
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkData();
