const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("user_info");
const onError = require("../utility/errorLog").onError

exports.add = async (event, context, user) => {
    const product = {
        productGuid: event.productGuid,
        typeGuid: event.typeGuid
    }
    const _ = db.command
    return collection.where({
        openid: user.openid
    }).update({
        data: {
            star: _.addToSet(product)
        }
    }).then(res => {
        if (res.stats.updated == 1 || res.stats.updated === 0) {
            return {
                isErr: false,
                err: ""
            }
        } else {
            return onError({
                err: "unknown error",
                product: product,
                result: res
            })
        }
    }).catch(err => { return onError(err) });
}

exports.rm = async (event, context, user) => {
    const product = {
        productGuid: event.productGuid,
        typeGuid: event.typeGuid
    }
    const _ = db.command
    return collection.where({
        openid: user.openid
    }).update({
        data: {
            star: _.pull(product)
        }
    }).then(res => {
        if (res.stats.updated == 1) {
            return {
                isErr: false,
                err: ""
            }
        } else if (res.stats.updated === 0) {
            return onError({
                err: "remove none form star",
                product: product
            }, "无法删除未收藏的商品")
        } else {
            return onError({
                err: "remove duplicate item form star",
                product: product
            }, "删除了多个商品")
        }
    }).catch(err => { return onError(err) });
}