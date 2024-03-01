const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("user_info");
const onError = require("../utility/errorLog").onError;

exports.add = async (event, context, user) => {
    var product = {
        productGuid: event.productGuid,
        typeGuid: event.typeGuid,
        number: event.number
    }

    // check number
    if (product.number < 1) {
        return onError({
            err: "number invalid!",
            product: product
        }, "数量异常")
    }

    // check if product already in cart
    const userCart = (await exports.get(null, null, user)).cart;
    for (const iterator of userCart) {
        if (iterator.productGuid == product.productGuid && iterator.typeGuid == product.typeGuid) {
            return onError({
                err: "product already in cart!",
                user: user,
                product: product
            }, "商品已在购物车")
        }
    }

    const _ = db.command
    return collection.where({
        openid: user.openid
    }).update({
        data: {
            cart: _.push({
                each: [product]
            })
        }
    }).then(res => {
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
        cart: true
    }).get().then(res => {
        return {
            isErr: false,
            err: null,
            cart: res.data[0].cart
        }
    }).catch(err => { return onError(err) });
}

exports.set = async (event, context, user) => {
    var product = {
        productGuid: event.productGuid,
        typeGuid: event.typeGuid,
        number: event.number
    }

    // check number
    if (product.number < 1) {
        return onError({
            err: "number invalid!",
            product: product
        }, "数量异常")
    }

    const cartList = (await exports.get(null, null, user))[0].cart;
    const cartIndex = cartList.findIndex(obj => {
        return obj.productGuid == product.productGuid && obj.typeGuid == product.productGuid;
    })

    // check if product in cart
    if (cartIndex === -1) {
        return onError({
            err: "product not in cart!",
            user: user,
            product: product
        }, "商品不在购物车")
    }

    return setNumber(user, product, cartIndex).then(res => {
        return {
            isErr: false,
            err: null
        }
    }).catch(err => { return onError(err) });
}

exports.rm = async (event, context, user) => {
    var product = {
        productGuid: event.productGuid,
        typeGuid: event.typeGuid
    }

    return removeItem(user, product).then(res => {
        return {
            isErr: false,
            err: null
        }
    }).catch(err => { return onError(err) });
}

async function setNumber(user, product, index) {
    return collection.where({
        openid: user.openid
    }).update({
        data: {
            cart: {
                [index]: {
                    number: product.number
                }
            }
        }
    })
}

async function removeItem(user, product) {
    const _ = db.command
    return collection.where({
        openid: user.openid
    }).update({
        data: {
            cart: _.pull(product)
        }
    })
}