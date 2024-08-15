import React, { ChangeEventHandler, FocusEventHandler, Fragment, KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { localStore } from '../../utils/store';
import {Button} from '@zw/components';
type Props = {}

const Search = (props: Props) => {
  // ref
  const inputRef = useRef<HTMLInputElement>(null);
  // state
  // 下拉框内的数据
  const [relatedList, setRelatedList] = useState<Array<string>>([]);
  // 当前选择的数据
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);
  // input 的内容
  const [inputValue, setInputValue] = useState<string>('');
  const [leftX, setLeftX] = useState<string>('');
  
  useEffect(() => {
    inputRef.current && setLeftX(`${inputRef.current?.getBoundingClientRect()?.x}px`)
  }, [inputRef])



  const handleFocus: FocusEventHandler<HTMLInputElement> | undefined = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    // 鼠标放进去的时候
    // 下拉框应该是数组，并且具备一定的存储功能
    setRelatedList(
      // @ts-ignore
      (localStore.get('historyArr') || [])
      .reduce((total: Array<string>, item: string) => total.find((i: string) => i === item) ? total : [...total, item], [])
      .filter((item: string) => Boolean(item))
      .filter((item: string) => (!e.target.value) || (e.target.value && item.includes(e.target.value)))
      .slice(0, 5)

    )
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    // 鼠标失去焦点的时候
    __clearAll();
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
    handleFocus(e as React.FocusEvent<HTMLInputElement, Element>);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    switch(e.key) {
      case "Enter":
        {
          // 敲回车
          const currentValue = (selectedIdx !== -1) ? relatedList[selectedIdx]: inputValue;
          // 我要把数据放到界面上
          setInputValue(currentValue);
          // 数据存一下
          // @ts-ignore
          localStore.unshift('historyArr', currentValue);
          __clearAll();
          break;
        }
      case "ArrowUp":
        {
          if(relatedList.length) {
            // 说明历史记录有内容
            if(selectedIdx !== 0 && selectedIdx !== -1) {
              setSelectedIdx(n => (n-1));
            } else {
              setSelectedIdx(relatedList.length -1)
            }
          }
          break;
        }
      case "ArrowDown":
        {
          if(relatedList.length) {
            if(selectedIdx < relatedList.length -1) {
              setSelectedIdx((n) => n+1)
            } else {
              setSelectedIdx(0)
            }
          }
        }
      
    }
  };

  const __clearAll = () => {
    setSelectedIdx(-1);
    setRelatedList([]);
  }

  return (
    <Fragment>
      <div className='flex items-center'>
          <input
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className='w-96 h-8 border border-gray-100 px-4 rounded-full bg-gray-50'
              placeholder='最近前端行情'
              ref={inputRef}
              value={inputValue}

          />
        <Button>提问</Button>
      </div>
      {
        (relatedList.length > 0) && <div
          style={leftX ? {left : leftX}: {}}
          className='fixed top-16 w-96 z-10 bg-white border-gray-200 rounded-md p-2 shadow-sm'
        >
          {
            relatedList.map((item, idx) => <div
            key={item}
            className={`${idx === selectedIdx ? "text-blue-600 bg-gray-100": 'text-gray-700 '} h-8 rounded-md px-2 flex items-center`}
            >
              {item}
            </div>)
          }
        </div>
      }
    </Fragment>
  )
}

export default Search