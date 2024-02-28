const cloud = require('wx-server-sdk');
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const collection = db.collection("user_info");
const onError = require("../utility/errorLog").onError

exports.main = async (event, context, user) => {
    const exist = (await collection.where({
        openid: user.openid
    }).get()).data.length;

    var toSet = {
        openid: user.openid,
        unionid: user.unionid
    }

    const defaultVar = [{
        name: "name",
        value: null
    }, {
        name: "image",
        value: null
    }, {
        name: "phone",
        value: null
    }, {
        name: "address",
        value: null
    }, {
        name: "type",
        value: 0
    }, {
        name: "exp",
        value: null
    }, {
        name: "coupon",
        value: []
    }, {
        name: "cart",
        value: []
    }, {
        name: "star",
        value: []
    }]

    for (const i of ["name", "image", "phone", "address", "type"]) {
        if (event[i] !== undefined && event[i] !== null && event[i] !== "") {
            toSet[i] = event[i];
        }
    }

    if (!exist) {
        for (const i of defaultVar) {
            if (!(i.name in toSet)) {
                toSet[i.name] = i.value;
            }
        }
        return collection.add({
            data: toSet
        }).then(res => {
            return {
                isErr: false,
                err: ""
            }
        }).catch(err => { return onError(err) })
    } else {
        return collection.where({
            openid: user.openid
        }).update({
            data: toSet
        }).then(res => {
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


}