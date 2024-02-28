## addOrder

parameter:
- *cart: Array (Object:
    - productGuid: string
    - typeGuid: string

return: 
- *isErr: bool
- *err: string 错误说明
- *orderGuid: string

## getOrder

parameter:
- *orderGuid: string

return: 
- *isErr: bool
- *err: string 错误说明
- order: Object:
    - status: string (待付款/待发货/待收货/待评价/已完成/退款中/已退款)
    - cart: Array (Object:
        - productGuid: string
        - productName: string
        - typeGuid: string
        - typeName: string
        - number: number
        - price: number (单件)
    - extraPayment: Array (Object:
        - name: string
        - price: number
    - coupon: Array (Object: **(pending)**
    - actualPayment: number
    - sendAddress: string
    - receiveAddress: string
    - time: Object:
        - create: Date
        - pay: Date
        - sent: Date
        - complete: Date
    - exp: int **(pending)**
    - expressID: Object
    - note: string

## payOrder (fake)

执行完后自动认为已支付

parameter:
- *orderGuid: string

return: 
- *isErr: bool
- *err: string 错误说明
- price: number

## setOrderExpress

expressID 请前端自行决定如何存储  
仅限农户端使用

parameter:
- *orderGuid: string
- *expressID: Object

return: 
- *isErr: bool
- *err: string 错误说明