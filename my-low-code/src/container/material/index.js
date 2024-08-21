import React, { useState } from 'react';
import styles from './index.module.css';
import { componentsList } from '../../components';

const Material = () => {
  const [isDragging,setIsDragging] =useState(false);
  const handleDragStart = (e, name) => {
    e.dataTransfer.setData('text/plain', name);
    setIsDragging(true);
  }

  const  handleDragEnd=()=>{
    setIsDragging(false);
  }
  return (
    <div className={styles.material_container}>
      <div className={styles.material_title}>组件区</div>
      <div>
        {componentsList.map((item,index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, item.name)}
            onDragEnd={handleDragEnd}
            className={styles.material_item}>{item.name}</div>
        ))}
      </div>
    </div>
  )
}

export default Material