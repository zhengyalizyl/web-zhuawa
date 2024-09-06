import { useAuth } from '@/wrappers/auth';
import React from 'react'
import { useNavigate } from 'umi';

const User = (props:any) => {
  const auth=useAuth();
  const navigate=useNavigate();

  return (
    <div>
      <p>{auth?.user?.username}</p>
      <button onClick={()=>{
         auth.signout(()=>navigate('/login'))
      }} >
        退出登录
      </button>
    </div>
  )
}

export default User