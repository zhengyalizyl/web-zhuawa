import React, { useContext, useState } from 'react';
import styles from './index.module.css';
import { PageContext } from '../../store';
import { v4 } from 'uuid';
import { componentsList } from '../../components';

const Editor = () => {
  const { list, setList, setCurrentConfigId } = useContext(PageContext);
  const  [isDragging,setIsDragging] =useState(false);

  const handleDragOver = (e) => {
    setIsDragging(true)
    e.preventDefault();
  }
  const handleDrop = (e) => {

    const droppedElementName = e.dataTransfer.getData('text/plain');
    console.log(droppedElementName,'----')
    setIsDragging(false);
    setList(list.concat({
      id: v4(),
      name: droppedElementName,
      props: {},
      style: {},
      children: []
    }))
  }

  const getComponent = (name) => {
    return componentsList.find(item => item.name == name);
  }

  const handleConfig = (id) => {
    setCurrentConfigId(id);
  }

  const handleDragEnd=(e)=>{
    setIsDragging(false);    
  }

  const handleDragStartItem = (event, id) => {
    //这里需要区别是外面的Dragg还是里面的Dragg
    //@to-do
    event.dataTransfer.setData('text/plain',id);
  };

  const handleDragOverItem = (event) => {
    event.preventDefault();
  };

  const handleDropItem = (event, index) => {
    event.preventDefault();
    const dragId = event.dataTransfer.getData('text/plain');
    const newItems = [...list];
    const dragIndex = newItems.findIndex(item => item.id == dragId);
    const draggedItem = newItems[dragIndex];

    newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, draggedItem);
    console.log(newItems,'------')

    setList(newItems);
  };


  return (
    <div
      className={`${styles.editor_container} ${isDragging? styles.editor_dragging:''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >{
        list.length>0&&list.map((item,index) => {
          console.log(item,'--------list')
          const Component = getComponent(item.name).component;
          return <div draggable 
          onDragStart={(event) => handleDragStartItem(event, item.id)}
          onDragOver={handleDragOverItem}
          onDrop={(event) => handleDropItem(event,item.id)}
          ><span onClick={() => handleConfig(item.id)}><Component key={item.name} {...item.props} /></span></div>
        })
      }
      {(!list||list.length===0)&&!isDragging&&(<div className={styles.editor_empty}>清拖拽组件到设计区</div>)}
      {(!list||list.length===0)&&isDragging&&(<div className={styles.editor_empty}>将组件拖拽到这里</div>)}
      
      </div>
  )
}

export default Editor