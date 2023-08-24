export default{
    'GET /umi/auth':(req,res)=>{
      res.send({
        isLogin:true
      })
    },
    'GET /umi/menus':(req,res)=>{
        res.send([
          {
            path: '/',
            component: 'layouts/base-layouts',
            routes: [
              {
                path: '/goods',
                wrappers: ["wrappers/auth"],
                component: 'layouts/aside-layouts',
                routes: [
                  { path: '/goods', component: 'pages/goods' },
                  { path: '/goods/:id', component: 'pages/goods/goods-detail' },
                  { path: '/goods/:id/comment', component: 'pages/goods/comment' },
                  { path: '/goods/:id/comment/:cid', component: 'pages/goods/comment-detail' }
                ]
              },
              {
                component: 'pages/404'
              }
            ]
          },
        ])
    }
}