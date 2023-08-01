const DesignArea = ({ components }) => {
  return (
    <div className="design-area">
      {components.map((component, index) => (
        <div key={index} style={component.style}>
          {renderComponent(component)}
        </div>
      ))}
    </div>
  );
};
const renderComponent = (component) => {
  // 根据组件类型，渲染相应的组件 
  switch (component.type) {
    case 'Button':
      return <Button {...component.props} />;
    case 'Input':
      return <Input {...component.props} />;
    // 添加更多的组件类型 
    default:
      return null;
  }
};