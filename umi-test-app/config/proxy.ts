export default {
  "/api":{
    traget:'http://192.168.1.20:7999',
    //依赖origin的功能可能需要这个，比如cookie
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  },
  "/book":{
    target:'https://api.zhuishushenqi.com',
    changeOrigin:true,
  }
}