// 外观（门面）模式
// scene
//axios 支持promise 风格调用

axios.get('/api/services',{
  params: {
    ID:11
  }
})
.then(res=>console.log(res))
.catch(err=>console.log(err))


axios.post('/api/services',{
  ID:11
},{
  headers:{
    'Content-Type':'application/json'
  }
})
.then(res=>console.log(res))
.catch(err=>console.log(err))


//request.js
import axios from 'axios';

export const get =function(url,params){
  return axios.get(url,{
    params
  })
}


export const post =function(url,params){
  return axios.post(url,
    {params},{
    headers:{
      'Content-Type':'application/json'
    }
  })
}

import {get ,post} from './request';
request(get,'/api/services',{
  ID:11
}).then(res=>console.log(res))

request(post,'/api/services',{
  ID:11
}).then(res=>console.log(res))



