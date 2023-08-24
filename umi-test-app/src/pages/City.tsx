import React from 'react'
import { IndexBar, List } from 'antd-mobile'
const charCodeOfA = 'A'.charCodeAt(0)
const getRandomList = (min: number, max: number): string[] => {
  return new Array(Math.floor(Math.random() * (max - min) + min)).fill(Math.random()*100)
}
const groups = Array(26)
  .fill('')
  .map((_, i) => ({
    title: String.fromCharCode(charCodeOfA + i),
    items: getRandomList(3, 10),
  }))
console.log(groups,'-------')


function City() {

  return (
    <div>
      <IndexBar>
        {groups.map(group => {
          const { title, items } = group
          return (
            <IndexBar.Panel
              index={title}
              title={`标题${title}`}
              key={`标题${title}`}
            >
              <List>
                {items.map((item, index) => (
                  <List.Item key={index}>{item}</List.Item>
                ))}
              </List>
            </IndexBar.Panel>
          )
        })}
      </IndexBar>
    </div>
  )
}

export default City