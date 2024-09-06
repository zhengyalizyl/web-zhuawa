import { defineConfig } from "umi";

// export default defineConfig({
//   routes: [
//     { path: "/", component: "index" },
//     { path: "/docs", component: "docs" },
//   ],
//   npmClient: 'npm',
// });

export default {
   base:'/sub-umi',
   npmClient: 'npm',
   plugins:['@umijs/plugins/dist/qiankun'],
   qiankun:{
      slave:{}
   },
   headScripts: [
      { src: 'https://unpkg.com/axios@1.1.2/dist/axios.min.js', ignore: true },
    ],
    routes:[
      { exact:true,path: "/", component: "index" ,redirect:'/docs'},
       {exact:true, path: "/docs", component: "docs" },
       {exact:true,path:'/posts/:postId',component:'posts/[postId]'},//动态路由
       {exact:true,path:'/user',component:'user',wrappers:['@/wrappers/auth']},//动态路由
       {exact:true,path:'/login',component:'login'},//动态路由
       {path:'*',component:'404'}
    ]
}
