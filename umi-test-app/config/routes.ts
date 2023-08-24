export default [
  {
    path: '/',
    component: '@/layouts/base-layouts',
    routes: [
      {
        path: '/login', component: '@/pages/login/index'
      },
      {
        path:'/goods',
        wrappers:["@/wrappers/auth"],
        component:'@/layouts/aside-layouts',
        routes:[
          {paht:'/goods',component:'@/pages/goods'},
          {path:'/goods/:id',component:'@/pages/goods/goods-detail'},
          {path:'/goods/:id/comment',componet:'@/pages/goods/comment'},
          {path:'/goods/:id/comment/:cid',componet:'@/pages/goods/comment-detail'}
        ]
      },
      {
        path: '/reg', component: '@/pages/reg'
      },
      {
        path: '/', redirect: '/login'
      },
      {
        component: '@/pages/404'
      }
    ]
  },
  {
    component: '@/pages/404'
  }]