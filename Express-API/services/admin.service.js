// show all user logic

const userModel = require("../models/user_model")


module.exports.getAllUser = async () => {
    const allUser = await userModel.find();

    return allUser;
}

module.exports.deleteUser = async (id) => {
    const user = await userModel.findOneAndDelete({_id: id});
    return user;
}

// Update role
module.exports.updateUserRole = async ({userId , role}) => {
    return await userModel.findOneAndUpdate(
        {_id: userId},
        {role},
        {new: true},
    );
};