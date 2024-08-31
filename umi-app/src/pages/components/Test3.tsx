import React, { useRef } from 'react';
import { List, CellMeasurer, CellMeasurerCache, AutoSizer } from 'react-virtualized';
import RcTree from 'rc-tree'; // 适用于 Ant Design v3 的 Tree 组件

const treeData = [
  {
    key: '0-0',
    title: 'parent 1',
    children: [{ key: '0-0-0', title: 'child 1-1' }],
  },
  {
    key: '0-1',
    title: 'parent 2',
    children: [{ key: '0-1-0', title: 'child 2-1' }],
  },
  // 更多树节点
];

// 使用 CellMeasurerCache 来缓存高度
const cache = new CellMeasurerCache({
  fixedWidth: true, // 宽度固定
  defaultHeight: 50, // 默认行高
});

const MyTreeWithVirtualizationAndDynamicHeight = () => {

  const listRef = useRef();

  const rowRenderer = ({ index, key, parent, style }) => (
    <CellMeasurer
      key={key}
      cache={cache}
      parent={parent}
      columnIndex={0}
      rowIndex={index}
    >
      {({ measure }) => (
        <div style={style}>
          <RcTree
            treeData={[treeData[index]]}
            defaultExpandAll
            onExpand={() => {
              cache.clear(index, 0); // 展开时清除缓存
              measure(); // 手动触发高度测量
              listRef.current.recomputeRowHeights(index); // 重新计算行高
            }}
          />
        </div>
      )}
    </CellMeasurer>
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          ref={listRef}
          width={width}
          height={height}
          rowCount={treeData.length}
          rowHeight={cache.rowHeight}
          deferredMeasurementCache={cache}
          rowRenderer={rowRenderer}
        />
      )}
    </AutoSizer>
  );
};

export default MyTreeWithVirtualizationAndDynamicHeight;
