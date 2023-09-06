import React, { Component } from 'react';
import _ from 'lodash'
import faker from 'faker';
import ItemList from '../item-list/item-list'

export default function SidePanel({
  open,
  onClose,
  title,
  children
}) {
  return (
    <div id="mySidenav" className="sidenav" style={{
      width: open ? '50vw' : 0,
      opacity: open ? 1 : 0,
      transform: open ? 'rotateX(0deg)' : 'rotateX(50deg)'
    }}>
      <a href="javascript:void(0)" className="closebtn" onClick={onClose}>&times;</a>
      <h3>{title}</h3>
      {children}
    </div>
  )
}
