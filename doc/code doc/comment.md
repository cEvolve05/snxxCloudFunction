## addComment

parameter:
- *orderGuid: string
- *product: Object:
    - productGuid: string
    - typeGuid: string
- *content: string
- image: Array (云文件ID, string)
- *rating: Array (number)

return: 
- *isErr: bool
- *err: string 错误说明

## getComment

parameter:
- *commentGuid: string

return: 
- *isErr: bool
- *err: string 错误说明
- comment: Object:
    - product: Object:
        - productGuid: string
        - typeGuid: string
    - userOpenid: string
    - time: Date
    - content: string
    - image: Array (云文件ID, string)
    - rating: Array (number) (1~5)

## getCommentList

parameter:
- *productGuid: string

return: 
- *isErr: bool
- *err: string 错误说明
- comments: Array(commentGuid)

## getUserCommentList

parameter: null

return: 
- *isErr: bool
- *err: string 错误说明
- comments: Array(commentGuid)

## rmComment

parameter:
- *commentGuid: string

return: 
- *isErr: bool
- *err: string 错误说明