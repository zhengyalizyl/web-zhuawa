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
}
