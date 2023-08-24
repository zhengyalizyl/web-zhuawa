import { defineConfig } from 'umi';
import theme from './theme';
import routes from './routes';

export default defineConfig({
  nodeModulesTransform: {//node-modules的编译
    type: 'none',
  },
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
  routes,
  fastRefresh: {},//快速刷新

  proxy:{
    "/api":{
      traget:'http://192.168.1.20:7999',
      changeOrigin: true,
      // pathRewrite: { '^/api': '' },
    }
  },
  antd:{
    mobile:false //需要将umi里面的插件关掉,使用我们安装的库
  },
  devServer:{
    // port:8081,//.env里面的权限更高一些
  },
  title:'zylTitle',
  favicon:'/favicon.ico',
  dynamicImport:{
    loading:'@/components/loading'
  },//按需加载
  mountElementId:'app',
  theme,
});
