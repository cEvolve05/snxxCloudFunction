const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("product_info");

exports.isProductOwner = async (userOpenid, productGuid) => {
    const product = (await collection.where({
        guid: productGuid
    }).get())[0]
    if (product.ownerId === userOpenid) {
        return true
    } else {
        return false
    }
};