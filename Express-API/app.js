const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const cookieParser = require("cookie-parser")

// route
const userRouter = require("./routes/web/v1/user.route");

const adminRouter = require("./routes/web/v1/admin.route")

const productRouter = require("./routes/web/v1/product.route")

const chatRouter = require("./routes/web/v1/chat.route")

const cartRouter = require("./routes/web/v1/cart.route")

const orderRouter = require("./routes/web/v1/order.route")

const wishlistRouter = require("./routes/web/v1/wishlist.route")

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
db();

// Temporary: Allow all origins to debug connectivity issues
app.use(cors({ 
    origin: true, 
    credentials: true 
}));

// Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));

PORT = process.env.PORT;

// temp route --> in backend we don't create home route. after testing / development remove home route
app.get("/", (req, res) => {
    res.status(401).json({ message: "Access Denied!!" });
});


app.use("/user", userRouter); //---> localhost:3005/user/register


app.use("/admin" , adminRouter); // --> url/admin/all/user

app.use("/product", productRouter);

app.use("/bot" , chatRouter)

app.use("/cart" , cartRouter)

app.use("/order" , orderRouter)

app.use("/wishlist" , wishlistRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
