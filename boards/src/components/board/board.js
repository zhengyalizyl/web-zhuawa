import React, { Component } from 'react';
import ItemList from '../item-list/item-list'
import Pulse from './pulse'

export default function Board({
  pulses,
  pulseActions,
  loadNextPage,
}) {
  return (
    <ItemList
      hasNextPage={false}
      isNextPageLoading={false}
      list={pulses}
      loadNextPage={() => false}
      itemActions={pulseActions}
      ItemRenderer={Pulse} // !! use capital letters else react will think it is an html tag. !!
    />
  )
}
