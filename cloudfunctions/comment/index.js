// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}); // 使用当前云环境

const db = cloud.database();
const onError = require("./utility/errorLog.js").onError;

// inPackage function
const comment = require("./function/comment.js");
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const user = {
        openid: wxContext.OPENID
    };
    console.log("User: ", user);
    switch (event.type) {
        case "addComment":
            return await comment.add(event, context, user);
        case "getComment":
            return await comment.get(event, context, user);
        case "setComment":
            return await comment.set(event, context, user);
        case "rmComment":
            return await comment.rm(event, context, user);
        case "getProductCommentList":
            return await comment.getProductList(event, context, user);
        case "getUserCommentList":
            return await comment.getUserList(event, context, user);

        default:
            return onError("Invalid event type");
    }
}