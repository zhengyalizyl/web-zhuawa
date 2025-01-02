//src/utils/request.js
import Http from '../http';

export function get(options){
  return Http.get(options);
}

export  function post(options){
  return Http.post(options);
}

import { get,post } from '@/src/utils/request'

let grayType=-1;
async function generateImage(){
  const body=this.generateBody();

  const options={
    url:'/getData',
    body,
    header
  }
  if(grayType!==-1){
    options.header.grayType=grayType;
  }
  const res =await post(options)
 
  if(res?.grayType){
    grayType =res.grayType;
  }

  if(res?.picUrl){
    return res?.picUrl
  }

  return null
}



//src/uitls/requestNew.js
import { get,post } from '@/src/uilts/request'

const getNewParams=(parmas)=>{
  let newParams;
  if(grayType!=-1){
    newParams ={
      ...params,
      header:{
        ...params.header,
        gratType
      }
    }
  }
  return newParams
}

export const grayTypeGet=async (params=>{
   const res= await get(getNewParams(params));
   if(res.grayType){
    grayType=res.grayType;
   }
   return res;
})