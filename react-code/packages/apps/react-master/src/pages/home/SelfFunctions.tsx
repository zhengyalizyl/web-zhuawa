
import React from 'react'

export default function SelfFunctions() {
  return (
    <div className='flex flex-col'>
        {
            [
              "我的收藏", "我关注的问题", "我的邀请", "我的余额", "我的礼券", "站务中心"
            ].map((item, idx) => 
                <div key={idx} className='flex flex-1 flex-row justify-between p-4 pb-2'>{item}</div>
            )
        }
    </div>
  )
}
