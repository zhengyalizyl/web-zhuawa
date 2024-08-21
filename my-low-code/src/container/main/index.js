import React, { useEffect, useState } from 'react';
import Material from '../material';
import Editor from '../editor';
import Config from '../config';
import styles from './index.module.css';
import { PageContext } from '../../store';
import {useUpdateEffect} from 'react-use'

const Main = () => {
  const [list,setList] =useState([]);
  const [currentConfigId,setCurrentConfigId] =useState('');
  useEffect(()=>{
     const cache =sessionStorage.getItem('list_cache');
     if(cache){
      setList(JSON.parse(cache))
     }
  },[])

  useUpdateEffect(()=>{
    sessionStorage.setItem('list_cache',JSON.stringify(list));
},[list])

  return (
    <div className={styles.main_container}>
      <PageContext.Provider value={{
        list,
        setList,
        currentConfigId,
        setCurrentConfigId
      }}>
        <Material />
        <Editor />
        <Config />
      </PageContext.Provider>
    </div>
  )
}

export default Main;