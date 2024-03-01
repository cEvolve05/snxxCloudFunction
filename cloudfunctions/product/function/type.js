const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("product_info");
const onError = require("../utility/errorLog").onError;
const newGuid = require("../utility/guid").main;
const isProductOwner = require("../utility/premissionChecker");

exports.checkExistence = async (event, context, user) => {
    const _ = db.command;
    return Boolean((await collection.where({
        guid: event.productGuid,
        type: _.elemMatch({
            guid: event.typeGuid
        })
    }).count()).total)
}

exports.add = async (event, context, user) => {
    type = {
        guid: newGuid(),
        name: event.name,
        price: event.price,
        number: event.number
    }

    while (await exports.checkExistence({
        productGuid: event.productGuid,
        typeGuid: type.guid
    }, null, null)) {
        type.guid = newGuid();
    }

    return collection.where({
        guid: event.productGuid
    }).update({
        data: {
            type: _.push(type)
        }
    }).then(res => {
        if (res.stats.updated === 0) {
            return onError({
                err: "product not found!",
                product: guid
            }, "商品未找到");
        }
        return {
            isErr: false,
            err: null,
            guid: type.guid
        }
    })
}

exports.get = async (event, context, user) => {
    return collection.where({
        guid: event.productGuid
    }).field({
        type: true
    }).get().then(res => {
        if (res.data.length === 0) {
            return onError({
                err: "product not found!",
                product: guid
            }, "商品未找到");
        }
        return {
            isErr: false,
            err: null,
            type: res.data[0].type
        };
    }).catch(onError);
}

exports.set = async (event, context, user) => {
    if (!isProductOwner(user.openid, event.productGuid)) {
        return onError({
            err: "Operation denied: no permission",
            user: user,
            product: event.productGuid
        }, "无修改权限")
    }

    type = {}
    fieldName = ["name", "price", "number"]
    for (const i of fieldName) {
        if (i in event) {
            type[i] = event[i];
        }
    }


    const index = (await exports.get(event, null, null)).indexOf(event.typeGuid);

    const _ = db.command;
    return collection.where({
        guid: event.productGuid
    }).update({
        data: {
            type: {
                [index]: type
            }
        }
    }).then(res => {
        if (res.stats.updated === 0) {
            return onError({
                err: "product not found!",
                product: guid
            }, "商品未找到");
        }
        return {
            isErr: false,
            err: null
        }
    }).catch(onError);
}

exports.rm = async (event, context, user) => {
    if (!isProductOwner(user.openid, event.productGuid)) {
        return onError({
            err: "Operation denied: no permission",
            user: user,
            product: event.productGuid
        }, "无修改权限")
    }

    return collection.where({
        guid: event.productGuid
    }).update({
        data: {
            type: _.pull({
                guid: event.typeGuid
            })
        }
    }).then(res => {
        if (res.stats.updated === 0) {
            return onError({
                err: "product not found!",
                product: guid
            }, "商品未找到");
        }
        return {
            isErr: false,
            err: null
        }
    }).catch(onError);
}