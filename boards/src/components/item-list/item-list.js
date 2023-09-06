import React, { Component } from 'react';
import 'react-virtualized/styles.css'
import { InfiniteLoader, List, WindowScroller } from 'react-virtualized'
import _ from 'lodash'
import faker from 'faker';
// import './app.css';

export default function ItemList ({
  hasNextPage,
  isNextPageLoading,
  list,
  loadNextPage,
  itemActions,
  ItemRenderer,
}) {

  const rowCount = hasNextPage ? list.length + 1 : list.length

  const loadMoreRows = isNextPageLoading
    ? () => {}
    : loadNextPage

  // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({ index }) => !hasNextPage || index < list.size

  // Render a list item or a loading indicator.
  const rowRenderer = ({ index, key, style }) => {

    const item = isRowLoaded({ index }) ? list[index] : {}

    return (
      <ItemRenderer
        key={key}
        item={item}
        index={index}
        style={style}
        loading={!isRowLoaded({ index })}
        itemActions={itemActions}
      />
    )
  }

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={rowCount}
    >
      {({ onRowsRendered, registerChild }) => (
        <WindowScroller>
        {({ height, isScrolling, scrollTop }) => (
          <List
            // autoHeight
            ref={registerChild}
            onRowsRendered={onRowsRendered}
            rowRenderer={rowRenderer}
            rowHeight={120}
            rowCount={rowCount}
            height={height}
            width={window.innerWidth}
          />
        )}
        </WindowScroller>
      )}
    </InfiniteLoader>
  )
}

const styles =  {
  row: {
    textAlign: 'left',
  }
}
