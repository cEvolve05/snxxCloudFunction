// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}); // 使用当前云环境

const db = cloud.database();
// inPackage function
const addComment = require("./function/addComment");
const rmComment = require("./function/rmComment");
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const user = {
        openid: wxContext.OPENID,
        unionid: wxContext.UNIONID
    };
    console.log("User: ", user);
    switch (event.type) {
        case "addComment":
            return await addComment.main(event, context, user);
        case "rmComment":
            return await rmComment.main(event, context, user);
        case "test":
            return {
                event: event,
                context: context,
                user: user
            }
        default:
            return "no specific type";
    }
}