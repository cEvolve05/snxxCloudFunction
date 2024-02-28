## checkUserExistence

return: bool

## addUser

parameter: 
- *type: int (0用户/1商家)
- *name: string
- *image: string (云文件ID)
- *phone: string
- *address: string

return: 
- *isErr: bool
- *err: string 错误说明

## setUserInfo

parameter:
- name: string
- image: string (云文件ID)
- phone: string
- address: string

return: 
- *isErr: bool
- *err: string 错误说明

## getUserProfile

仅获取用户名称和头像，

parameter:
- *openid: string

return: 
- *isErr: bool
- *err: string 错误说明
- user: Object
    - name: string
    - image: string 云文件ID

## getUserInfo

return: 
- *isErr: bool
- *err: string 错误说明
- user: Object:
    - *type: int (0用户/1商家)
    - name: string
    - image: string (云文件ID)
    - phone: string
    - address: string
    - exp: int **(pending)**

## addCart

行为类似于push

parameter: 
- *productGuid: string
- *typeGuid: string
- *number: number

return: Object: 
- *isErr: bool
- *err: string 错误说明

## setCart


parameter: 
- *productGuid: string
- *typeGuid: string
- *number>=1: number

return: Object: 
- *isErr: bool
- *err: string 错误说明

## getCart

parameter: null

return: Object: 
- *isErr: bool
- *err: string 错误说明
- cart: Array (Object:
    - productGuid: string
    - typeGuid: string
    - number: number

## rmCart

parameter: 
- *productGuid: string
- *typeGuid: string

return: Object: 
- *isErr: bool
- *err: string 错误说明

## addStar

行为类似于push

parameter: 
- *productGuid: string

return: Object: 
- *isErr: bool
- *err: string 错误说明

## getStar

parameter: null

return: Object: 
- *isErr: bool
- *err: string 错误说明
- *star: Array (string productGuid

## rmStar

删除未收藏的商品会出错

parameter: 
- *productGuid: string

return: Object: 
- *isErr: bool
- *err: string 错误说明