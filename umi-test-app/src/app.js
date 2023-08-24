import {  history,request} from "umi"

let routesData = [];//动态路由
export const render = async (oldRender) => {
  //权限校验业务
  //oldRender 需至少被调用一次
  const { isLogin } = await request('/umi/auth');
  if (!isLogin) {
    history.push('/login')
  } else {
    routesData = await request('/umi/menus');
  }
  oldRender();
}


//添加路由
export const patchRoutes = ({ routes }) => {
  //添加一条数据，需要有exact:true,require
  // routes.push({
  //   exact:true,component:require('@/pages/404').default
  // })

  filterRoutes(routesData)//处理添加exact,require添加component
  routesData.map(item => routes.push(item))
}

//处理读到的路由数据
//动态路由的component要的是一个组件不是一段地址，可通过require引入
//动态路由读取后，跳转后不显示，需要关闭mfsu:{}
//子路由不跳转，除了layout组件，其它需要添加exact
//数据里面不可以有require,数据需要过滤，require（非空字符拼接+变量）
//document.ejs报错，需要require拼接时找到index.jsx,目前umi3有这个问题
const filterRoutes = (routesArr) => {
  routesArr.map(item => {
    if (item.routes && item.routes.length > 0) {
      filterRoutes(item.routes)
    } else {
      item.exact = true;
    }

    if(!item.redirect){
        if(item.component.includes('404')){
          item.component=require('@/'+item.component+'.tsx').default;
        }else{
          item.component=require('@/'+item.component+'/index.tsx').default;
        }

        if(item.wrappers&&item.wrappers.length>0){
          item.wrappers.map((str,index)=>{
            item.wrappers[index]=require('@/'+str+'.tsx').default
          })
        }
    }


  })
}


export  const onRouteChange=({matchedRoutes,location,routes,action})=>{

   document.title=matchedRoutes[matchedRoutes.length-1].route.title||'zyl'

}

// export const request={
//   // errorConfig:{}//错误处理
//   // timeout:1000,//延时
//   // middlewares:[],使用中间件
//    // 统一的请求设定
//    timeout: 1000,
//    headers: {'X-Requested-With': 'XMLHttpRequest'},
//   requestInterceptors:[
//     (url,options)=>{
//       //请求
//       options.headers={token:'1222'};
//       return url
//     }
//   ],
//   reponseInterceptors:[]
// }

