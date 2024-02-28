// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}); // 使用当前云环境

const db = cloud.database();
const onError = require("./utility/errorLog.js").onError;

// inPackage function
const addMain = require("./function/addMain");
const setMain = require("./function/setMain");
const hideMain = require("./function/hideMain");
const addType = require("./function/addType");
const setType = require("./function/setType");
const rmType = require("./function/rmType");
const getProduct = require("./function/getProduct");
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const user = {
        openid: wxContext.OPENID
    };
    console.log("User: ", user);
    switch (event.type) {
        case "addMain":
            return await addMain.main(event, context, user);
        case "setMain":
            return await setMain.main(event, context, user);
        case "hideMain":
            return await hideMain.main(event, context, user);
        case "addType":
            return await addType.main(event, context, user);
        case "setType":
            return await setType.main(event, context, user);
        case "rmType":
            return await rmType.main(event, context, user);
        case "getProduct":
            return await getProduct.main(event, context, user);
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