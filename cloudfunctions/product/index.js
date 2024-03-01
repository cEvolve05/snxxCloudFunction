// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}); // 使用当前云环境

const db = cloud.database();
const onError = require("./utility/errorLog.js").onError;

// inPackage function
const product = require("./function/product.js");
const type = require("./function/type.js");
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const user = {
        openid: wxContext.OPENID
    };
    console.log("User: ", user);
    switch (event.type) {
        case "checkProductExistence":
            return await product.checkExistence(event, context, user);
        case "checkTypeExistence":
            return await type.checkExistence(event, context, user);

        case "addProduct":
            return await product.add(event, context, user);
        case "setProduct":
            return await product.get(event, context, user);
        case "hideProduct":
            return await product.set(event, context, user);
        case "hideProduct":
            return await product.rm(event, context, user);

        case "addType":
            return await type.add(event, context, user);
        case "getType":
            return await type.get(event, context, user);
        case "setType":
            return await type.set(event, context, user);
        case "rmProduct":
            return await type.rm(event, context, user);

        default:
            return onError("Invalid event type");
    }
}