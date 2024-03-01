// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}); // 使用当前云环境

const db = cloud.database();
const onError = require("./utility/errorLog.js").onError;

// inPackage function
const order = require("./function/order.js");

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const user = {
        openid: wxContext.OPENID
    };
    console.log("User: ", user);
    switch (event.type) {
        case "addOrder":
            return await order.add(event, context, user);
        case "getOrder":
            return await order.get(event, context, user);
        case "getMerchantOrderList":
            return await order.getMerchantList(event, context, user);
        case "getUserOrderList":
            return await order.getUserList(event, context, user);
        case "payOrder":
            return await order.pay(event, context, user);
        case "setOrderSend":
            return await order.setSend(event, context, user);
        case "setOrderReceive":
            return await order.setReceive(event, context, user);

        default:
            return onError("Invalid event type");
    }
}