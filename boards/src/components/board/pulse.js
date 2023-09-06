import React from 'react';
import _ from 'lodash';
import ItemList from '../item-list/item-list';
import './pulse.css'

export default function Pulse({
  index,
  style,
  item,
  itemActions,
}) {

  const { _id: id, updatesCount, content } = item;

  const onPulseClick = () => itemActions.showUpdates(id);

  return (
    <div
      className='bong-rotate'
      style={_.merge(style, styles.row, {
        background: `hsl(${(index * (360 / 120) % 360)},100%,50%)`,
        color: `hsl(${(index * (360 / 120) % 360)},60%,25%)`,
      })}
    >
      <span style={{paddingLeft: 10}}>{content}</span>
      {updatesCount > 0 &&
        <span onClick={onPulseClick} className='bong pulse-item-updates-counter'>{updatesCount}</span>
      }
    </div>
  )
}

const styles =  {
  row: {
    paddingTop: 50,
    paddingLeft: 20,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bolder',
    display: 'flex',
    borderTop: '10px solid #222',
    borderBotttom: '10px solid #222'
  }
}
