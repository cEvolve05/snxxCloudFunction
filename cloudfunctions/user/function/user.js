const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("user_info");
const onError = require("../utility/errorLog").onError;
const newGuid = require("../utility/guid").main;

exports.checkExistence = async (event, context, user) => {
    return Boolen((await collection.where({
        openid: user.openid
    }).get()).data.length);
}

exports.add = async (event, context, user) => {
    // extra attached data for other precess
    const extraVar = [{
        name: "exp",
        value: 0
    }, {
        name: "coupon",
        value: []
    }, {
        name: "cart",
        value: []
    }, {
        name: "star",
        value: []
    }];

    // get parameter from event
    for (const i of ["name", "image", "phone", "address", "type"]) {
        if (event[i] !== undefined && event[i] !== null && event[i] !== "") {
            user[i] = event[i];
        } else {
            return onError({
                err: "missing or inproper parameter",
                parameter: i
            }, "缺少数据或数据为空")
        }
    }

    for (const iterator of extraVar) {
        user[iterator.name] = iterator.value;
    }

    collection.add({
        data: user
    }).then(res => {
        return {
            isErr: false,
            err: ""
        }
    }).catch(err => { return onError(err) })
}

exports.set = async (event, context, user) => {
    // check if user exist
    if (!exports.checkExistence(null, null, user)) {
        return onError({
            err: "User not exist",
            user: user
        }, "用户不存在")
    }

    // construct user data to update
    toSet = {};
    for (const i of ["name", "image", "phone", "address"]) {
        if (event[i] !== undefined && event[i] !== null && event[i] !== "") {
            toSet[i] = event[i];
        }
    }

    return collection.where({
        openid: user.openid
    }).update({
        data: toSet
    }).then(res => {
        if (res.stats.updated === 0) {
            return onError({
                err: "Update none docs",
                user: user,
            }, "未更新任何数据")
        }
        if (res.stats.updated > 1) {
            return onError({
                err: "Update duplicate docs",
                number: res.stats.updated,
                toSet: toSet
            })
        }

        return {
            isErr: false,
            err: ""
        }
    }).catch(err => { return onError(err) })
}

exports.getProfile = async (event, context, user) => {
    return collection.where({
        openid: event.openid
    }).field({
        name: true,
        image: true,
    }).get().then(res => {
        if (res.data.length === 0) {
            return onError({
                err: "User not exist",
                user: user
            }, "用户不存在")
        }
        if (res.data.length > 1) {
            return onError({
                err: "duplicate user!",
                user: user
            }, "用户重复")
        }

        return res.data[0];
    }).catch(err => { return onError(err) })
}

exports.getInfo = async (event, context, user) => {
    return collection.where({
        openid: user.openid,
    }).field({
        type: true,
        name: true,
        image: true,
        phone: true,
        address: true,
        exp: true,
    }).get().then(res => {
        if (res.data.length == 0) {
            return onError({
                err: "User not exist",
                user: user
            }, "用户不存在")
        }
        if (res.data.length > 1) {
            return onError({
                err: "duplicate user!",
                user: user
            }, "用户重复")
        }

        return res.data[0];
    }).catch(err => { return onError(err) })
}