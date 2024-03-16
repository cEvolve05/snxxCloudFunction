## checkProductExistence

parameter:
- *productGuid: string

return: Boolean

## addProduct

parameter:
- *name: string
- *image: Array (云文件ID, string)
- *description: string
- *address: string
- *category: string
- *quality: string
- *advantage: string
- *warranty: string

return: 
- *isErr: bool
- *err: string 错误说明
- *productGuid: string

## getProduct

parameter:
- *productGuid: string

return: 
- *isErr: bool
- *err: string 错误说明
- product: Object:
    - *name: string
    - *image: Array (云文件ID, string)
    - *description: string
    - *address: string
    - *category: string
    - *quality: string
    - *advantage: string
    - *warranty: string

## setProduct

parameter: 
- *productGuid: string
- name: string
- image: Array (云文件ID, string) // 会替换整个array
- description: string
- address: string
- category: string
- quality: string
- advantage: string
- warranty: string

return: Object:
- *isErr: bool
- *err: string 错误说明

## rmProduct

用于移除商品

parameter:
- *productGuid: string

return: Object:
- *isErr: bool
- *err: string 错误说明

## checkTypeExistence

parameter:
- *productGuid: string
- *typeGuid: string

return: Boolean

## addType

parameter:
- *name: string
- *price: number
- *number: number

return:
- *isErr: bool
- *err: string 错误说明
- *typeID: string

## getType

parameter:
- *productGuid: string
- *typeGuid: string

return:
- *isErr: bool
- *err: string 错误说明
- type: Array (Object:
    - guid: string
    - name: string
    - number: number
    - price: number

## setType

parameter:
- *productGuid: string
- *typeGuid: string
- name: string
- price: number
- number: number

return: Object:
- *isErr: bool
- *err: string 错误说明

## rmType

parameter:
- *productGuid: string
- *typeGuid: string

return: Object:
- *isErr: bool
- *err: string 错误说明