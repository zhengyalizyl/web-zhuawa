import React, { useState, useEffect, useRef } from 'react';
import { Tree, Spin } from 'antd';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import 'react-virtualized/styles.css';
const { TreeNode } = Tree;
const MyTree = () => {
  const [treeData, setTreeData] = useState([
    { title: 'Root Node', key: '0-0', children: [], isLeaf: false, loading: false, loaded: false },
  ]);
  const [loadingKeys, setLoadingKeys] = useState([]);
  
  // 创建一个缓存器来存储每一行的高度
  const cache = useRef(new CellMeasurerCache({
    fixedWidth: true, // 固定宽度，动态高度
    defaultHeight: 40, // 默认行高
  }));
  const listRef = useRef(null);

  // 异步加载数据
  const onLoadData = async (treeNode) => {
    const { key, children } = treeNode;
    if (children.length > 0) {
      return;
    }

    setLoadingKeys((prev) => [...prev, key]);

    const newChildren = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from({ length: 10 }, (_, i) => ({
          title: `${key}-${i}`,
          key: `${key}-${i}`,
          isLeaf: i % 2 === 0,
          children: [],
        })));
      }, 1000);
    });

    setTreeData((prev) => {
      const addChildren = (nodes) => {
        nodes.forEach((node) => {
          if (node.key === key) {
            node.children = newChildren;
            node.loaded = true;
          } else if (node.children) {
            addChildren(node.children);
          }
        });
      };
      const newData = [...prev];
      addChildren(newData);
      return newData;
    });

    setLoadingKeys((prev) => prev.filter((k) => k !== key));
  };

  // 渲染树节点
  const renderTreeNode = ({ index, key, parent, style }) => {
    const node = treeData[index];

    return (
      <CellMeasurer
        key={key}
        cache={cache.current}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {({ measure }) => (
          <div style={style} onLoad={measure}>
            <Tree
              loadData={onLoadData}
             

            >
              {renderTreeNodes([node])}
              </Tree>
          </div>
        )}
      </CellMeasurer>
    );
  };

  const renderTreeNodes = (data:any) =>
    data.map((item:any) => {
      if (item.children) {
        return (
          <TreeNode
            id={item.key}
            title={item.title}
            key={item.key}
            dataRef={item}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode id={item.key} key={item.key} {...item} dataRef={item} />;
    });



  return (
    <div>
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            width={width}
            height={height}
            rowCount={treeData.length}
            rowHeight={cache.current.rowHeight}
            // deferredMeasurementCache={cache.current}
            rowRenderer={renderTreeNode}
            overscanRowCount={5}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default MyTree;
