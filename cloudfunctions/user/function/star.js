const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("user_info");
const onError = require("../utility/errorLog").onError;

exports.add = async (event, context, user) => {
    const _ = db.command
    return collection.where({
        openid: user.openid
    }).update({
        data: {
            star: _.addToSet(event.productGuid)
        }
    }).then(res => {
        if (res.stats.updated > 1) {
            return onError({
                err: "unknown error",
                product: product,
                result: res
            })
        }

        return {
            isErr: false,
            err: null
        }
    }).catch(err => { return onError(err) });
}

exports.get = async (event, context, user) => {
    return collection.where({
        openid: user.openid
    }).field({
        star: true
    }).get().then(res => {
        return {
            isErr: false,
            err: null,
            star: res.data[0].star
        }
    }).catch(err => { return onError(err) });
}

exports.rm = async (event, context, user) => {
    const _ = db.command
    return collection.where({
        openid: user.openid
    }).update({
        data: {
            star: _.pull(event.productGuid)
        }
    }).then(res => {
        if (res.stats.updated === 0) {
            return onError({
                err: "remove none form star",
                product: product
            }, "无法删除未收藏的商品")
        }
        if (res.stats.updated > 1) {
            return onError({
                err: "unknown error",
                product: product,
                result: res
            })
        }

        return {
            isErr: false,
            err: null
        }
    }).catch(err => { return onError(err) });
}