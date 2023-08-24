import React from 'react'
import { useHistory } from 'umi';

const list=[{
   id:'1',
   name:'zyl'
},{
  id:'2',
  name:'zyl2'
}]
function Nowplaying(props:any) {
   const history=useHistory();

  return (
    <div>
      {list.map((item:any)=>(
         <div key={item.id} onClick={()=>{
              history.push(`/detail/${item.id}`)
         }}>{item.name}</div>
      ))}
    </div>
  )
}

export default Nowplaying