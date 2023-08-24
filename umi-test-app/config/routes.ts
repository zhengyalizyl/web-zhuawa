// export default [
//   {
//     path: '/login', component: '@/pages/login/index'
//   },
//   {
//     path: '/reg', component: '@/pages/reg'
//   },
//   {
//     path: '/',
//     component: '@/layouts/base-layouts',
//     routes: [
//       {
//         path: '/goods',
//         wrappers: ["@/wrappers/auth"],
//         component: '@/layouts/aside-layouts',
//         routes: [
//           { paht: '/goods', component: '@/pages/goods' },
//           { path: '/goods/:id', component: '@/pages/goods/goods-detail' },
//           { path: '/goods/:id/comment', component: '@/pages/goods/comment' },
//           { path: '/goods/:id/comment/:cid', component: '@/pages/goods/comment-detail' }
//         ]
//       },
//       {
//         path: '/', redirect: '/login'
//       },
//       {
//         component: '@/pages/404'
//       }
//     ]
//   },
//   {
//     component: '@/pages/404'
//   }]



export default [
  {
    path: '/login', component: '@/pages/login/index'
  },
  {
    path: '/reg', component: '@/pages/reg'
  },
  // {
  //   component: '@/pages/404'
  // }
]