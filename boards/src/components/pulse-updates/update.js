import React from 'react';
import _ from 'lodash';
import ItemList from '../item-list/item-list';
import './update.css'

export default function Update({
  index,
  style,
  item,
  onItemClick,
}) {

  const { content } = item;

  return (
    <div
      className='bong-rotate'
      style={_.merge(style, styles.row, {
        color: `hsl(${(index * (360 / 120) % 360)},100%,50%)`,
      })}
    >
      <img src={`https://api.adorable.io/avatars/80/${index%8}.png`} style={styles.avatar}/>

      <span>{content}</span>

    </div>
  )
}

const styles =  {
  row: {
    paddingLeft: 5,
    width: '100%',
    textAlign: 'left',
    fontSize: 13,
    fontWeight: 'bolder',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderTop: '10px solid #222',
    borderBotttom: '10px solid #333',
    background: '#111',
  },
  avatar: {
    borderRadius: '50%',
    height: 80,
    width: 80,
    marginRight: 5,
  }
}
