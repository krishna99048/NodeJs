const orderService = require("../services/order.service")


// create order
module.exports.CreateOrder = async (req , res) => {
    try {
        const userId = req.user.id;
        const {items} = req.body;

        const order = await orderService.CreateOrder({userId, items})

        if (!order) {
            return res.status(404).json({ message: "Products Not Found" });
        }

        return res.status(200).json({message : "Order Created Successfully" , order})

    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}

// get order history and show order status
module.exports.GetOrder = async (req, res) =>{
    try {
        const userId = req.user.id;
        const orders = await orderService.GetOrder(userId);

        if(!orders || orders.length === 0) {
            return res.status(200).json({message: "No orders found", orders: []});
        }

        return res.status(200).json({message: "Orders Fetch Successfully", orders});

    } catch (error) {
         return res.status(400).json({message: error.message});
    }
}

