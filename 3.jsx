import React from 'react';
// ⽰例按钮组件 
const Button = ({ text }) => {
  return <button>{text}</button>;
};
// ⽰例输⼊框组件 
const Input = ({ placeholder }) => {
  return <input type="text" placeholder={placeholder} />;
};
// ⻚⾯组件 
const Page = ({ title, components }) => {
  return (
    <div>
      <h1>{title}</h1>
      {components.map((component, index) => {
        const Component = componentMapping[component.type];
        return <Component key={index} {...component.props} />;
      })}
    </div>
  );
};
// 组件映射 
const componentMapping = {
  Button,
  Input
};
// 应⽤程序 
const App = () => {
  const jsonData = {
    // JSON数据 
  };
  return <Page title={jsonData.title} components={jsonData.components} />;
};
export default App; 