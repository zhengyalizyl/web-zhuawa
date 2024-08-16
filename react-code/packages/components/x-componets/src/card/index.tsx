import React, { ReactNode } from 'react';

type CardType={
  className?:string;
  children?:ReactNode;
}

const Card=({className,children}:CardType)=> {
  return (
    <div className={`bg-white border border-gray-200 m-2 rounded-sm shadow-md ${className}`}>
      {children}
    </div>
  )
}

export default Card