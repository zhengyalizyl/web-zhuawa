const handleDragStart = (event, componentId) => {
  // 设置拖动数据 
  event.dataTransfer.setData('text/plain', componentId);
};
const handleDragOver = (event) => {
  // 阻⽌默认⾏为以允许放置 
  event.preventDefault();
  // 获取拖动数据 
  const componentId = event.dataTransfer.getData('text/plain');
  // 根据组件标识符识别组件 
  const draggedComponent = findComponentById(componentId);
  // 处理拖放⽬标元素的逻辑 
  // ... 
};