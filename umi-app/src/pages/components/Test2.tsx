import React, { useState, useRef, useEffect } from 'react';
import { Tree } from 'antd';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import './index.css'

const { TreeNode } = Tree;


const MyTree = () => {
  const [treeData, setTreeData] = useState([
    { title: 'Expand to load', key: '0' },
      { title: 'Expand to load', key: '1' },
      { title: 'Tree Node', key: '2', isLeaf: true },
  ]);

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [loadingKeys, setLoadingKeys] = useState([]);
  

  const listRef = useRef(null);
  // 创建一个缓存器来存储每一行的高度
  // const cache = useRef(new CellMeasurerCache({
  //   fixedWidth: true, // 固定宽度，动态高度
  //   defaultHeight: 60, // 默认行高
  // }));
  // 使用 CellMeasurerCache 来缓存高度
const cache = new CellMeasurerCache({
  fixedWidth: true, // 宽度固定
  defaultHeight: 20, // 默认行高
});

  // 异步加载数据
  const onLoadData = async treeNode => {
    const {
      itemKey:key, children, title } = treeNode.props;

    if (children && children.length > 0) {
      return;
    }

    setLoadingKeys([...loadingKeys, key]);

    const newChildren = await new Promise(resolve => {
      setTimeout(() => {
        resolve(
          Array.from({ length: 2 }, (_, i) => ({
            title: `${title}-${i}`,
            key: `${key}-${i}`,
            isLeaf: i % 2 === 0,
            children:[]
          }))
        );
      }, 1000);
    });
  

    const updateTreeData = (list, key, children) =>
      list.map(node => {
        if (node.key === key) {
          return {
            ...node,
            children,
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateTreeData(node.children, key, children),
          };
        }
        return node;
      });


    setTreeData(updateTreeData(treeData, key, newChildren));
    setLoadingKeys(loadingKeys.filter(k => k !== key));
  };

  const renderTreeNodes = data =>{
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} itemKey={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} itemKey={item.key} {...item} dataRef={item} />;
    });
  }
  const onExpand=(keys,measure,index)=>{
    setExpandedKeys(keys);
       // 重新计算
    // cache.clear?.(index, 0); // 展开时清除缓存
    // measure && measure();
    // listRef.current?.recomputeRowHeights?.(index); // 重新计算行高

  }


  // 渲染列表项
  const rowRenderer = ({ index, key, style,parent }) => {
    const node = treeData[index];
    return (
      <div>
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {({ measure,registerChild }) => (
          <div style={style}  ref={registerChild}>
            <Tree
              loadData={onLoadData}
              onExpand={(keys)=>onExpand(keys,measure,index)}
              expandedKeys={expandedKeys}
             
            >
              {renderTreeNodes([node])}
            </Tree>
          </div>
        )}
      </CellMeasurer>
      </div>
    );
  };

  return (
    <div style={{ height: "50vh", width: "100%" }}>
     <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            width={width}
            height={height}
            rowCount={treeData.length}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer> 
    </div>
  );
};

export default MyTree;
