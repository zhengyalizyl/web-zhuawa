import React from 'react'
import { Redirect, useLocation } from 'umi';

export default function Film(props:any) {
  const {children}=props;
  const location=useLocation();
  if(location.pathname==='/film'||location.pathname==='/film/'){
    return <Redirect to="/film/nowplaying" />
  }
  return (
    <div>
      <div>layout</div>
      {children}
    </div>
  )
}
