import {useAuth } from '@/wrappers/auth';
import React, { FormEvent, useContext } from 'react'
import { Navigate, useLocation, useNavigate } from 'umi';


 const Login = () => {
  const auth=useAuth();
  const navigate=useNavigate();
  const location =useLocation();
  const from =location.state?.from?.pathname||'/';
      console.log(auth,'-----')
  if(auth?.user){
    return <Navigate to={from}/>
  }

  const submit=(e:any)=>{
    const formData=new FormData(e.currentTarget);
    const username=formData.get('username');
    auth?.signin({username},()=>{
       navigate(from,{replace:true})
    })

  }
  return (
    <div>
      <form onSubmit={submit}>
        <input  type="text" name="username"/>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login