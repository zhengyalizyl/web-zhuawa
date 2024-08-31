import yayJpg from '../assets/yay.jpg';
import axios from 'axios';
import { useEffect,useState } from 'react';
import TreeWithVirtualScroll from './components/TreeWithVirtualScroll';
import Test from './components/Test2';
import TableTest from './components/TableTest'
import 'antd/dist/antd.css';
import "react-virtualized/styles.css";

export default function HomePage() {
  useEffect(()=>{
    axios.get('/list').then(res=>console.log(res))
  },[])

  const [treeData,setTreeData] =useState([ { title: 'Expand to load 0', key: '0' },
    { title: 'Expand to load 1', key: '1',children:[] },
    { title: 'Tree Node', key: '2', isLeaf: true,children:[] },]) 

  return (
    <div>
     测试 -react-vir
     <TreeWithVirtualScroll treeData0={treeData}/>
     test--------
     <Test/>
     {/* <TableTest/> */}
    </div>
  );
}
