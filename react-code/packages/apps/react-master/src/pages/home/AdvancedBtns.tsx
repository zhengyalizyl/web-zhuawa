import React from 'react'

export default function AdvancedBtns() {
    return (
        <div className='flex flex-col'>
            <div className='flex flex-1 flex-row justify-between p-4 flex-wrap'>
                <div className='flex flex-col w-1/3 items-center hover:text-blue-500 cursor-pointer'>
                    <div className='h-14 w-14 text-blue-500 flex justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className='my-2'>live</div>
                </div>
                <div className='flex flex-col w-1/3 items-center hover:text-orange-500 cursor-pointer'>
                    <div className='h-14 w-14 text-orange-500 flex justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                    </div>
                    <div className='my-2'>书店</div>
                </div>
                <div className='flex flex-col w-1/3 items-center hover:text-amber-500 cursor-pointer'>
                    <div className='h-14 w-14 text-amber-500 flex justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <div className='my-2'>圆桌</div>
                </div>
                <div className='flex flex-col w-1/3 items-center hover:text-emerald-500 cursor-pointer'>
                    <div className='h-14 w-14 text-emerald-500 flex justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <div className='my-2'>专栏</div>
                </div>
                <div className='flex flex-col w-1/3 items-center hover:text-emerald-500 cursor-pointer'>
                    <div className='h-14 w-14 text-emerald-500 flex justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <div className='my-2'>付费咨询</div>
                </div>
                <div className='flex flex-col w-1/3 items-center hover:text-emerald-500 cursor-pointer'>
                    <div className='h-14 w-14 text-emerald-500 flex justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <div className='my-2'>百科</div>
                </div>
            </div>

        </div>
    )
}
