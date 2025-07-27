import React from 'react'
import BasicLayout from '../components/BasicLayout'


function Layout({children}: {children:React.ReactNode}) {
  return (
   <BasicLayout>
    <div className="container mx-auto p-4">
      {children}
    </div>
   </BasicLayout>
  )
}

export default Layout