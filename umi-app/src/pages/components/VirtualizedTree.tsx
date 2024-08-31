import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import React, { useState, useEffect, useRef } from "react";
import { Tree, Tooltip, Icon } from "antd";
const { TreeNode } = Tree;
import './index.css'


//这里要将扁平数据转成树状结构
// 将扁平化数组转换为树状结构的函数
const arrayToTree = (data) => {
  const tree = [];
  const childrenOf = {}; // 存储每个节点的子节点列表

  // 初始化childrenOf对象，所有节点都没有子节点
  data.forEach((item) => {
    childrenOf[item.key] = childrenOf[item.key] || [];
    item.children = childrenOf[item.key];
    // 如果该节点有父节点，将其添加到父节点的子节点列表中
    if (item.parentKey == null) {
      tree.push(item);
    } else {
      childrenOf[item.parentKey] = childrenOf[item.parentKey] || [];
      childrenOf[item.parentKey].push(item);
    }
  });

  return tree;
};

// 将树状结构转换为扁平化数组的函数
const treeToArray = (tree) => {
  const result = [];

  // 递归遍历树
  const traverse = (node) => {
    result.push({ ...node }); // 将节点添加到结果数组中
    // delete node.children; // 删除children属性
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => traverse(child)); // 递归遍历子节点
    }
  };

  tree.forEach(node => traverse(node)); // 从根节点开始遍历
  return result;
};


const fetchChildren = (eventKey:any) =>
  new Promise((resolve) => {
    setTimeout(() => {
     const children= Array.from({ length: 100 }, (_, i) => ({
        title: `${eventKey}-${i}`,
        key: `${eventKey}-${i}`,
        isLeaf: false,
        children: [],
      }))
      console.log(children,eventKey)

      resolve(children);
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

const VirtualizedTree = ({
  flatData,
  expandedKeys,
  onExpand,
  setFlatData,
  treeData,
  setTreeData,
}:any) => {
 const [autoExpandParent,setAutoExpandParent] =useState(true)
  const listRef = useRef(null); // 参考VariableSizeList的引用
  // 使用 CellMeasurerCache 来缓存高度
  const cache = new CellMeasurerCache({
    fixedWidth: true, // 宽度固定
    defaultHeight: 20, // 默认行高
  });


   useEffect(()=>{
    const a=arrayToTree(flatData);
    setTreeData(a);
   },[flatData])
  const loadData = async (treeNode) => {
    // 模拟异步请求获取子节点数据
    const children = await fetchChildren(treeNode.props.eventKey);
    // 更新扁平化的树数据
    const newFlatData = flatData.map((node) => {
      if (node.key === treeNode.props.eventKey) {
        return {
          ...node,
          children: children.map((child) => ({
            ...child,
            level: node.level + 1,
            parentKey: node.key,
            isLeaf: !child.children,
          })),
        };
      }
      return node;
    });

    setFlatData(treeToArray(newFlatData));
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
            itemKey={item.key}
            {...item}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode id={item.key} itemKey={item.key} key={item.key} {...item} dataRef={item} />;
    });


  const rowRenderer = ({ index, key, style,parent }:any) => {
    const node = treeData[index];
    if (!node) return null;

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
              loadData={loadData}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onExpand={(keys)=>{
            //     setExpandedKeys(keys);
            //     // 重新计算
         
             setAutoExpandParent(false)
             onExpand(keys)
                //  cache.clear?.(index, 0); // 展开时清除缓存
            //  measure && measure();
            // listRef.current?.recomputeRowHeights?.(index); // 重新计算行高
              }
            }
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

export default VirtualizedTree;