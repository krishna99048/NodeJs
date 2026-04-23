// const userModel = require("..models/user.model")




module.exports.authAdmin = (req , res , next) => {
    const user = req.user;

    if (!user || user.role !== "admin") {
        return res.status(401).json({message: "Access Denined"})
    }

    next();
}