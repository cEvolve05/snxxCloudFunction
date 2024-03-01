## addOrder

parameter:
- *productGuid: string
- *list: Array (Object:
    - typeGuid: string
    - number: number
- note: string

return: 
- *isErr: bool
- *err: string 错误说明
- orderGuid: string

## getOrder

parameter:
- *orderGuid: string

return: 
- *isErr: bool
- *err: string 错误说明
- order: Object:
    - status: string (待付款/待发货/待收货/待评价/已完成/退款中/已退款)
    - productGuid: string
    - list: Array (Object:
        - typeGuid: string
        - number: number
        - price: number (单件)
    - actualPayment: number
    - receiveAddress: string
    - sendAddress: string
    - expressID: Object
    - time: Object:
        - create: Date
        - pay: Date
        - send: Date
        - receive: Date
    - note: string

## payOrder (fake)

执行完后自动认为已支付，正常情况下应该返回微信预付单，并在前端请求支付

parameter:
- *orderGuid: string

return: 
- *isErr: bool
- *err: string 错误说明
- price: number (临时)

## setOrderSend

expressID 请前端自行决定如何存储  
仅限农户端使用

parameter:
- *orderGuid: string
- *expressID: Object

return: 
- *isErr: bool
- *err: string 错误说明

## setReceive

parameter:
- *orderGuid: string

return: 
- *isErr: bool
- *err: string 错误说明