import { lazy } from 'react'
import { useRoutes } from 'react-router-dom'

const Chat=lazy(()=>import('@/views/chat/index.tsx'));
const Exception404=()=>import('@/views/exception/404/index.tsx');
const Exception500=()=>import('@/views/exception/500/index.tsx');
const routes=[
  {
    path:'/',
    name:'Root',
    redirect:'/chat',
    children:[{
      path:'chat/:uuid?',
      name:'Chat',
      element:Chat
    }]
  },
  {
    path:'/404',
    name:'404',
    element:Exception404
  },
  {
      path:'/500',
      name:'500',
      element:Exception500
  },
  {
    path:'*',
    name:'NotFound',
    redirect:'/404'
  }
]


function  WrapperRoutes(){
  const element=useRoutes(routes)
  return element
}