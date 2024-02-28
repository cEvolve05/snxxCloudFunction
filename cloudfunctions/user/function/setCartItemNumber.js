const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("user_info");
const onError = require("../utility/errorLog").onError

exports.main = async (event, context, user) => {
    var product = {
        productGuid: event.productGuid,
        typeGuid: event.typeGuid
    }

    exist = await getProduct(product)
    if (!exist) {
        return onError({
            err: "not find product!",
            product: product
        }, "商品不存在")
    }

    const toRemove = event.number === 0;
    if (toRemove) {
        return removeItem(user, product).then(res => {
            return {
                isErr: false,
                err: ""
            }
        }).catch(err => { return onError(err) });
    }

    product.number = ("number" in event && event.number >= 1) ? event.number : 1;

    const list = (await getCartList(user))[0].cart;
    const cartIndex = list.findIndex(obj => {
        return obj.productGuid == product.productGuid && obj.typeGuid == product.productGuid;
    })
    if (cartIndex!==-1) {
        return setNumber(user, product, cartIndex).then(res => {
            return {
                isErr: false,
                err: ""
            }
        }).catch(err => { return onError(err) });
    } else {
        return addToCart(user, product).then(res => {
            return {
                isErr: false,
                err: ""
            }
        }).catch(err => { return onError(err) });
    }
}

async function getProduct(product) {
    const _ = db.command;
    return (await db.collection("product_info").where({
        guid: product.productGuid,
        type: _.elemMatch({
            guid:product.typeGuid
        })
    }).count()).total
}

async function addToCart(user, product) {
    const _ = db.command
    return collection.where({
        openid: user.openid
    }).update({
        data: {
            cart: _.unshift(product)
        }
    });
}

async function getCartList(user) {
    return (await collection.where({
        openid: user.openid
    }).field({
        cart: true
    }).get()).data;
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