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
        guid: event.productGuid
    }).count()).total)
}

exports.add = async (event, context, user) => {
    product = {
        guid: newGuid(),
        ownerId: user.openid,
        name: event.name,
        image: event.image,
        description: event.description,
        address: event.address,
        quality: event.quality,
        advantage: event.advantage,
        warranty: event.warranty,
    }

    while (await exports.checkExistence({
        productGuid: product.guid
    }, null, null)) {
        product.guid = newGuid();
    }

    const defaultVar = [{
        name: "type",
        value: []
    }, {
        name: "sold",
        value: 0
    }, {
        name: "hidden",
        value: false
    }]

    for (const i of defaultVar) {
        if (!(i.name in product)) {
            product[i.name] = i.value;
        }
    }

    return collection.add({
        data: product
    }).then(res => {
        return {
            isErr: false,
            err: null,
            guid: product.guid
        }
    }).catch(onError);
}

exports.get = async (event, context, user) => {
    return collection.where({
        guid: event.productGuid
    }).field({
        name: true,
        image: true,
        description: true,
        address: true,
        category: true,
        quality: true,
        advantage: true,
        warranty: true,
    }).get().then(res => {
        return {
            isErr: false,
            err: null,
            product: res.data[0]
        }
    }).catch(onError);
}

exports.set = async (event, context, user) => {
    if (!isProductOwner(user.openid, event.productGuid)) {
        return onError({
            err: "Operation denied: no permission to set product",
            user: user,
            product: event.productGuid
        }, "无修改权限")
    }

    product = {}
    fieldName = ["name", "description", "address", "category", "quality", "advantage", "warranty"]
    for (const i of fieldName) {
        if (i in event) {
            product[i] = event[i];
        }
    }

    const _ = db.command
    if ("image" in event) {
        product.image = _.set(event.image);
    }
    return updateProduct(event.productGuid, product);
}

// abandoned
exports.hide = async (event, context, user) => {
    if (!isProductOwner(user.openid, event.productGuid)) {
        return onError({
            err: "Operation denied: no permission",
            user: user,
            product: event.productGuid
        }, "无修改权限")
    }

    return updateProduct(event.productGuid, {
        hidden: true
    });
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
    }).remove().then(res => {
        if (res.stats.updated == 0) {
            return onError({
                err: "product not found to delete",
                product: event.productGuid
            }, "商品未找到");
        }
        return {
            isErr: false,
            err: null
        };
    }).catch(onError);
}

async function updateProduct(guid, data) {
    return collection.where({
        guid: guid
    }).update({
        data: data
    }).then(res => {
        if (res.stats.updated == 0) {
            return onError({
                err: "product not found!",
                product: guid
            }, "商品未找到");
        }
        return {
            isErr: false,
            err: null
        };
    }).catch(onError);
}
