import { Redirect } from "umi"

export default (props:any)=>{
  if(Math.random()<0.9){
     return <div>{props.children}</div>
  }else{
    return <Redirect to="/login"/>
  }
}