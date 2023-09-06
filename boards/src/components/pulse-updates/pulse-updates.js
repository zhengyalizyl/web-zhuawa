import React, { Component } from 'react';
import ItemList from '../item-list/item-list'
import Update from './update'

export default function PulseUpdates({updates}) {
  return (
    <ItemList
      hasNextPage={false}
      isNextPageLoading={false}
      list={updates}
      loadNextPage={() => false}
      ItemRenderer={Update} // !! use capital letters else react will think it is an html tag. !!
    />
  )
}
