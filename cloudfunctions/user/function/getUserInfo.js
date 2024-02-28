const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("user_info");
const onError = require("../utility/errorLog").onError

exports.main = async (event, context, user) => {
    return collection.where({
        openid: user.openid,
    }).get().then(res => {
        if (res.data.length == 0) {
            return {
                isDefault: true
            };
        }
        if (res.data.length > 1) {
            return onError({
                err: "duplicate user!",
                user: user
            }, "duplicate user!")

        }
        res.data[0].isDefault = false
        return res.data[0];
    }).catch(err => { return onError(err) })
}