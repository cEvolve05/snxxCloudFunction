// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}); // 使用当前云环境

const db = cloud.database();
const onError = require("./utility/errorLog.js").onError;

// inPackage function
const newOrder = require("./function/newOrder");
const payOrder = require("./function/payOrder");
const getOrder = require("./function/getOrder");

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const user = {
        openid: wxContext.OPENID
    };
    console.log("User: ", user);
    switch (event.type) {
        case "newOrder":
            return await newOrder.main(event, context, user);
        case "payOrder":
            return await payOrder.main(event, context, user);
        case "getOrder":
            return await getOrder.main(event, context, user);
        case "test":
            return {
                event: event,
                context: context,
                user: user
            }
        default:
            return onError("Invalid event type");
    }
}