const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("user_info");
const onError = require("../utility/errorLog").onError;
const newGuid = require("../utiliorLog").onError;

exports.checkProductExistence = async (event, context, user) => {
    product = {
        productGuid: event.productGuid,
        typeGuid: event.typeGuid
    }
    const _ = db.command;
    return Boolean((await db.collection("product_info").where({
        guid: product.productGuid,
        type: _.elemMatch({
            guid: product.typeGuid
        })
    }).count()).total)
}