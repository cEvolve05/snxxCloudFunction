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
    const userObj = {
        openid: wxContext.OPENID
    };
    console.log("User: ", userObj);
    switch (event.type) {
        case "checkUserExistence":
            return await user.checkExistence(event, context, userObj);

        case "addUser":
            return await user.add(event, context, userObj);
        case "setUserInfo":
            return await user.set(event, context, userObj);
        case "getUserProfile":
            return await user.getProfile(event, context, userObj);
        case "getUserInfo":
            return await user.getInfo(event, context, userObj);

        case "addCart":
            return await cart.add(event, context, userObj);
        case "setCart":
            return await cart.set(event, context, userObj);
        case "getCart":
            return await cart.get(event, context, userObj);
        case "rmCart":
            return await cart.rm(event, context, userObj);

        case "addStar":
            return await star.add(event, context, userObj);
        case "getStar":
            return await star.get(event, context, userObj);
        case "rmStar":
            return await star.rm(event, context, userObj);
        default:
            return onError("Invalid event type");
    }
}