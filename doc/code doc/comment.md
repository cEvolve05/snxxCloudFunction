## addComment

rating 格式前端自行处理

parameter:
- *orderGuid: string
- *content: string
- image: Array (云文件ID, string)
- *rating: Object

return: 
- *isErr: bool
- *err: string 错误说明

## setComment

parameter:
- *orderGuid: string
- content: string
- image: Array (云文件ID, string) (完整替换)
- rating: Object

return: 
- *isErr: bool
- *err: string 错误说明

## getComment

parameter:
- *orderGuid: string

return: 
- *isErr: bool
- *err: string 错误说明
- comment: Object:
    - userOpenid: string
    - time: Date
    - content: string
    - image: Array (云文件ID, string)
    - rating: Array (number) (1~5)

## getProductCommentList

parameter:
- *productGuid: string

return: 
- *isErr: bool
- *err: string 错误说明
- comments: Array(Object 结构同getComment一致)

## getUserCommentList

parameter: null

return: 
- *isErr: bool
- *err: string 错误说明
- comments: Array(Object 结构同getComment一致)

## rmComment

parameter:
- *orderGuid: string

return: 
- *isErr: bool
- *err: string 错误说明