调用示例：

```js
wx.cloud.callFunction({
      name: '...',
      data: {
        type: '...'
        // other parameter
      }
    }).then(res=>{
        // return value process
    })
```

带有\*的为必传参数/必含返回值

unionid 目前没用

错误处理：

- isErr
- err

isErr 为 true 时，可能不含其他的数据，err是可以显示给用户的内容
