import React from 'react'
import {  request, useDispatch, useHistory,useRequest, useSelector } from 'umi';

const  GoodsDetail=()=>{
  const dispatch =useDispatch();
  const  test=useSelector(state=>state);
  const history=useHistory();
   const getComment=async()=>{
    await request('umi/goods',{
      method:'post',
      data:{
         a:1
      }
    })
    // history.push(`/goods/3/comment`)
    history.push({
      pathname:'/goods/3/comment',
      query:{a:3}
    })
   }
  return (
    <div>
      <p>goodDetails</p>
      <button onClick={getComment}>跳转到评论</button>
    </div>
  )
}

export default GoodsDetail