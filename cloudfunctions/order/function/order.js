const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("order_info");
const onError = require("../utility/errorLog").onError;
const newGuid = require("../utility/guid").main;
const canReadOrder = require("../utility/premissionChecker").canReadOrder;

exports.add = async (event, context, user) => {
    order = {
        guid: newGuid(),
        status: "待付款",
        productGuid: event.productGuid,
        buyerId: user.openid,
        list: event.list,
        time: {
            create: Date.now()
        },
        note: event.note || null,
        expressID: null,
        actualPayment: 0,
    }

    const product = getProduct(event.productGuid)

    order.merchantId = product.ownerId

    // save price to order
    for (const i in order.list) {
        order.list[i].price = product.type.find(x => x.guid === order.list[i].typeGuid).price;
    }

    // save addresses to order
    order.receiveAddress = getUserAddess(user.openid)
    order.sendAddress = product.address;

    // calculate total price to actualPayment
    for (const i in order.list) {
        order.actualPayment += order.list[i].price * order.list[i].number;
    }

    return collection.add({
        data: order
    }).then(res => {
        return {
            isErr: false,
            err: null,
            orderGuid: order.guid
        }
    }).catch(onError)
}

exports.get = async (event, context, user) => {
    if (!canReadOrder(user.openid, event.orderGuid)) {
        return onError({
            err: "Permission denied",
            user: user,
            order: event.orderGuid,
        }, "无权限访问订单");
    }

    return collection.where({
        guid: event.orderGuid
    }).field({
        merchantId: true,
        status: true,
        productGuid: true,
        list: true,
        actualPayment: true,
        receiveAddress: true,
        sendAddress: true,
        expressID: true,
        time: true,
        note: true,
    }).get().then(res => {
        return {
            isErr: false,
            err: null,
            order: res.data[0]
        };
    }).catch(onError)
}

exports.pay = async (event, context, user) => {
    await collection.where({
        guid: event.orderGuid
    }).update({
        data: {
            status: "待发货",
            time: {
                pay: Date.now()
            }
        }
    })
    return collection.where({
        guid: event.orderGuid
    }).get().then(res => {
        return {
            isErr: false,
            err: null,
            price: res.data[0].actualPayment
        }
    }).catch(onError)
}

exports.setSend = async (event, context, user) => {
    if (!canReadOrder(user.openid, event.orderGuid)) {
        return onError({
            err: "Permission denied",
            user: user,
            order: event.orderGuid,
        }, "无权限访问订单");
    }

    const _ = db.command;
    return collection.where({
        guid: event.orderGuid
    }).update({
        data: {
            status: "待收货",
            expressID: _.set(event.expressID),
            time: {
                send: Date.now()
            }
        }
    }).then(res => {
        return {
            isErr: false,
            err: null
        }
    }).catch(onError)
}

exports.setReceive = async (event, context, user) => {
    if (!canReadOrder(user.openid, event.orderGuid)) {
        return onError({
            err: "Permission denied",
            user: user,
            order: event.orderGuid,
        }, "无权限访问订单");
    }

    const _ = db.command;
    return collection.where({
        guid: event.orderGuid
    }).update({
        data: {
            status: "已完成",
            time: {
                receive: Date.now()
            }
        }
    }).then(res => {
        return {
            isErr: false,
            err: null
        }
    }).catch(onError)
}

async function getUserAddess(userOpenid) {
    return await collection.where({
        openid: userOpenid,
    }).field({
        address: true
    }).get().then(res => {
        return res.data[0].address;
    })
}

async function getProduct(productGuid) {
    return await collection.where({
        guid: productGuid
    }).get().then(res => {
        return res.data[0];
    });
}