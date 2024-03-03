## userInfo:

- openid: string
- name: string
- image: string (云文件ID)
- phone: string
- address: string
- type: int (0用户/1商家)
- exp: int **(pending)**
- coupon: Array (Object: **(pending)**
	- guid: string
	- name: string
- cart: Array (Object:
    - productGuid: string
    - typeGuid: string
    - number: number
- star: Array (Object:
    - productGuid

## productInfo:

- guid: string
- ownerId: string openid
- name: string
- image: Array (云文件ID, string)
- description: string
- address: string
- type: Array (Object:
    - guid: string //唯一标识符
    - name: string //名称，用于显示
    - number: number //剩余数量
    - price: number //单价
- category: string
- quality: string
- advantage: string
- warranty: string
- sold: number
- hidden: bool

## orderInfo:

- guid: string
- buyerId: string openid
- merchantId: string openid
- status: string (待付款/待发货/待收货/待评价/已完成/退款中/已退款)
- productGuid: string //商品的guid
- list: Array (Object://参见productInfo.type，为订单包含的type
    - typeGuid: string
    - number: number
    - price: number (单件)
- actualPayment: number
- sendAddress: string
- receiveAddress: string
- time: Object:
    - create: Date
    - pay: Date
    - send: Date
    - receive: Date
- expressID: Object
- note: string

## commentInfo

- orderGuid: string
- productGuid: string
- userOpenid: string
- time: Date
- content: string
- image: Array (云文件ID, string)
- rating: Object

## chat: 

(前端实现，存储到chat集合，[link](https://developers.weixin.qq.com/community/develop/article/doc/0008e43fa6899078091d0039454413) )

## 上传图像说明：

[link](https://developers.weixin.qq.com/minigame/dev/wxcloud/guide/storage/api.html) ，图片上传到对应文件夹：
- productImg: 商品介绍
- profileImg: 个人头像
- chatImg: 聊天图片
命名保证不重复

## guid实现参考：

```js
() => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```