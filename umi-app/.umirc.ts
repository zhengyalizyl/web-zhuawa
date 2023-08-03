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
   }
}
