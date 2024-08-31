import VirtualizedTree from "./VirtualizedTree";
import React, { useState, useEffect, useMemo } from "react";
import lodash from 'lodash'
import { useLatest } from "react-use";


 export const flattenTreeData = (treeData:any, expandedKeys = []) => {
  const result = [];
  const traverse = (nodes, level = 0, parentKey = null) => {
    nodes.forEach((node) => {
      const { children,isLeaf, ...rest } = node;
      result.push({ ...rest, level, parentKey, isLeaf: isLeaf||!children });
      if (children && expandedKeys.includes(node.key)) {
        traverse(children, level + 1, node.key);
      }
    });
  };

  traverse(treeData);
  return result;
};

const TreeWithVirtualScroll = ({ treeData0 }) => {

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [flatData, setFlatData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [renderedData, setRenderedData] = useState([]);
  const [currentChunk, setCurrentChunk] = useState(0);
  const renderedDataRef=useLatest(renderedData)
  
  useEffect(()=>{
  setTreeData([...treeData0]);
    const a=flattenTreeData(treeData0, expandedKeys);
    setFlatData(a);
  },[treeData0])

  const onExpand = (key) => {
    setExpandedKeys(key);
  };


   
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };
  const chunks = useMemo(()=>{
   return  chunkArray(flatData, 100)// 每次处理100个节点
  },[flatData]); 



   useEffect(() => {
    let currentChunk = 0;

    const processChunk = () => {
      if (currentChunk < chunks.length) {
        console.log(chunks,chunks[currentChunk],currentChunk,renderedData,'onload')
        const a=lodash.unionBy(renderedDataRef.current,chunks[currentChunk],'key');
        setRenderedData(a)
        currentChunk += 1;
        // 使用 requestIdleCallback 渐进式渲染
        requestIdleCallback(processChunk);
      }
    };

    processChunk(); // 开始处理第一个 chunk
  }, [chunks]);



  return (
    <div style={{ height: "50vh", width: "100%",border:'1px solid red' }}>
      <VirtualizedTree
        flatData={renderedData}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        setFlatData={setFlatData}
        treeData={treeData}
        setTreeData={setTreeData}
      />
    </div>
  );
};

export default TreeWithVirtualScroll;