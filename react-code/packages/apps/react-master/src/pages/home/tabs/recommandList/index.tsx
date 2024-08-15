import React, { FC } from 'react'
import { mockList } from './mockList';

interface IProps {
    item: any
}

const RecommendData: FC<IProps> = ({item}) => {
    return <div className='flex flex-col items-start p-4 border-b'>
        {/* 标题部分 */}
        <div className='h-auto flex justify-start'>
            <a 
            className='font-bold text-black text-lg leading-10'
            target='_blank'
            href={`https://www.zhihu.com/question/${item?.target?.question?.id}/answer/${item?.target?.id}`}>
                {
                    item?.target?.question?.title || item?.target?.title
                }
            </a>
        </div>
    </div>
}

type ListProps = {}

const RecommandList = (props: ListProps) => {
  return (
    <div className='flex flex-col border-t'>
        {
            mockList.map((item: any, idx) => <RecommendData key={item.id + idx} item={item} />)
        }
    </div>
  )
}

export default RecommandList;