import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

type Props = {}
const tabs = [
    { name:"关注", to: '/follow' },
    { name:"推荐", to: '/' },
    { name:"热榜", to: '/hot' },
    { name:"视频", to: '/zvideo' },

]

const Tabs = (props: Props) => {
  return (
    <div className='w-full'>
        <div className='flex mx-6 box-border'>
            {
                tabs.map((item) => <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) => " whitespace-nowrap py-4 px-4 text-base transition-all " + (
                        isActive ? "text-blue-600 font-bold" : "text-black hover:text-blue-900"
                    )}
                >
                    {item.name}
                </NavLink>)
            }
        </div>
        <Outlet />
    </div>
  )
}

export default Tabs