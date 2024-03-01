const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("order_info");

exports.canReadOrder = async (userOpenid, orderGuid) => {
    const order = (await collection.where({
        guid: orderGuid
    }).get())[0]
    if (order.buyerId === userOpenid || order.merchantId === userOpenid) {
        return true
    } else {
        return false
    }
};