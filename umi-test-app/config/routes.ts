export default [
  {
    path: '/login', component: '@/pages/Login'
  }, {
    path: '/reg', component: '@/pages/reg'
  },{
     path:'/',redirect:'/login'
  },
{
   component:'@/pages/404'
}]