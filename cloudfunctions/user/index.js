// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}); // 使用当前云环境

const db = cloud.database();
const onError = require("./utility/errorLog.js").onError;

// inPackage function
const user = require("./function/user.js");
const cart = require("./function/cart.js");
const star = require("./function/star.js");

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const user = {
        openid: wxContext.OPENID
    };
    console.log("User: ", user);
    switch (event.type) {
        case "checkUserExistence":
            return await user.checkExistence(event, context, user);

        case "addUser":
            return await user.add(event, context, user);
        case "setUserInfo":
            return await user.set(event, context, user);
        case "getUserProfile":
            return await user.getProfile(event, context, user);
        case "getUserInfo":
            return await user.getInfo(event, context, user);

        case "addCart":
            return await cart.add(event, context, user);
        case "setCart":
            return await cart.set(event, context, user);
        case "getCart":
            return await cart.get(event, context, user);
        case "rmCart":
            return await cart.rm(event, context, user);

        case "addStar":
            return await star.add(event, context, user);
        case "getStar":
            return await star.get(event, context, user);
        case "rmStar":
            return await star.rm(event, context, user);
        default:
            return onError("Invalid event type");
    }
}