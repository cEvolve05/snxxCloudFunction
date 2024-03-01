const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("product_info");
const onError = require("../utility/errorLog").onError;
const newGuid = require("../utility/guid").main;

exports.main = async (event, context, user) => {
    // codes
}