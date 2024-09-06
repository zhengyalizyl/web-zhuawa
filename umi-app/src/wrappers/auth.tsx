import { Navigate, Outlet, useLocation } from "umi";
import React, { useContext, useState } from 'react'


const RequiredAuth=(props:any)=>{
      const auth=useAuth();
      const location =useLocation();
      if(!auth?.user){
        return <Navigate to={"/login"} state={{from:location}} replace={true} />
      }
    
      return <Outlet/>
}


const fakeAuthProvider={
  isAuthenticated:false,
  signin(callback){
    fakeAuthProvider.isAuthenticated=true;
    setTimeout(callback,100)
  },
  signout(callback){
    fakeAuthProvider.isAuthenticated=false;
    setTimeout(callback, 100);
  }
}

export const AuthConext =React.createContext({});

export function AuthProvider({children}){
   const [user,setUser] =useState(null);
   const signin=(newUser,callback)=>{
    setUser(newUser);
    callback();
   }

   const signout=(callback)=>{
    setUser(null);
    callback();
   }

   let value={
    user,
    signin,
    signout
   }

   return <AuthConext.Provider value={value} children={children}/>

}


export const useAuth=()=>{
   return useContext(AuthConext)
}


export default RequiredAuth;