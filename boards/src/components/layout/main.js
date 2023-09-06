import React, { Component } from 'react';
import _ from 'lodash'
import faker from 'faker';

export default function Main({sideIsOpen, children}) {
  return (
    <div id="main">
      {children}
    </div>
  )
}
