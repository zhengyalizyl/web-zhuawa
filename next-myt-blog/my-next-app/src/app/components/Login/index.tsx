import Link from 'next/link'
import React from 'react'

const  Login=()=> {
  return (
    <div className="flex justify-between container mx-auto w-11/12 md:w-2/3 lg:w-1/2">
        <Link href="/home" className='text-3xl font-bold'>home</Link>
        <div className='text-xl space-x-4'>
            <Link href="/performance" className='text-xl font-bold'>Performance</Link>
            <Link href="/reliability" className='text-xl font-bold'>reliability</Link>
        </div>
    </div>
  )
}

export default Login