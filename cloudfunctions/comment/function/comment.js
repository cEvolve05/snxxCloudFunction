const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("comment_info");
const onError = require("../utility/errorLog").onError;
const newGuid = require("../utility/guid").main;

exports.add = async (event, context, user) => {
    comment = {
        userOpenid: user.openid,
        productGuid: getProductGuidFormOrder(event.orderGuid),
        orderGuid: event.orderGuid,
        content: event.content,
        image: event.image || null,
        rating: event.rating,
        time: Date.now()
    }

    return collection.add({
        data: comment
    }).then(res => {
        return {
            isErr: false,
            err: null,
        }
    }).catch(onError)
}

exports.set = async (event, context, user) => {
    const _ = db.command
    comment = {
        content: event.content || undefined,
        image: event.image !== undefined ? _.set(event.image) : undefined,
        rating: event.rating !== undefined ? _.set(event.rating) : undefined,
    }

    return collection.where({
        orderGuid: event.orderGuid
    }).update({
        data: comment
    }).then(res => {
        return {
            isErr: false,
            err: null,
        }
    }).catch(onError)
}

exports.get = async (event, context, user) => {
    return getCommentByCondition({ orderGuid: event.orderGuid }).then(res => {
        return {
            isErr: false,
            err: null,
            comment: res.data[0]
        };
    }).catch(onError);
}

exports.getProductList = async (event, context, user) => {
    return getCommentByCondition({ productGuid: event.productGuid }).then(res => {
        return {
            isErr: false,
            err: null,
            comments: res.data[0]
        };
    }).catch(onError);
}

exports.getUserList = async (event, context, user) => {
    return getCommentByCondition({ userOpenid: user.openid }).then(res => {
        return {
            isErr: false,
            err: null,
            comments: res.data[0]
        };
    }).catch(onError);
}

exports.rm = async (event, context, user) => {
    return collection.where({
        orderGuid: event.orderGuid
    }).remove().then(res => {
        return {
            isErr: false,
            err: null,
        }
    }).catch(onError)
}

async function getCommentByCondition(condition) {
    return collection.where(condition).field({
        userOpenid: true,
        content: true,
        image: true,
        rating: true,
        time: true,
    }).get()
}

async function getProductGuidFormOrder(orderGuid) {
    return (await db.collection("order_info").where({
        guid: orderGuid
    }).get())[0].productGuid
}