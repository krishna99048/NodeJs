
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ecommerce";

const images = {
  "Audio": [
    "https://images.unsplash.com/photo-1608156639585-34a0a56ee6c9?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"
  ],
  "Wearables": [
    "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=800"
  ],
  "Accessories": [
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800"
  ],
  "Cameras": [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"
  ]
};

async function updateImages() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const Product = mongoose.model("Product", new mongoose.Schema({}, { strict: false }));
    const products = await Product.find({});
    
    for (const product of products) {
      const categoryImages = images[product.category] || ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"];
      await Product.updateOne({ _id: product._id }, { $set: { images: categoryImages } });
      console.log(`Updated images for: ${product.name}`);
    }

    console.log("All product images updated!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

updateImages();
