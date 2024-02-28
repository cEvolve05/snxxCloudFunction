// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}); // 使用当前云环境

const db = cloud.database();
// inPackage function
const getUserInfo = require("./function/getUserInfo.js");
const getUserProfile = require("./function/getUserProfile.js");
const setUserInfo = require("./function/setUserInfo.js");
const setCartItemNumber = require("./function/setCartItemNumber.js")
const star = require("./function/star.js");

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const user = {
        openid: wxContext.OPENID,
        unionid: wxContext.UNIONID
    };
    console.log("User: ", user);
    switch (event.type) {
        case "getUserInfo":
            return await getUserInfo.main(event, context, user);
        case "getUserProfile":
            return await getUserProfile.main(event, context, user);
        case "setUserInfo":
            return await setUserInfo.main(event, context, user);
        case "setCartItemNumber":
            return await setCartItemNumber.main(event, context, user);
        case "addStar":
            return await star.add(event, context, user);
        case "rmStar":
            return await star.rm(event, context, user);
        case "test":
            return{
                event: event,
                context: context,
                user: user
            }
        default:
            return "no specific type";
    }
}