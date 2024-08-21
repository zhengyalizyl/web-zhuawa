import React, { useContext, useState } from 'react';
import styles from './index.module.css';
import { PageContext } from '../../store';
import { componentsList } from '../../components';
import { cloneDeep } from 'lodash';
import { v4 } from 'uuid'
import { ColorPicker, Input, Select, Switch } from 'antd';

const Config = () => {
  const { currentConfigId, list, setList } = useContext(PageContext);
  const renderConfig = () => {

    if (currentConfigId) {
      const currentComponent = list.find(item => item.id === currentConfigId);
      const currentComponentName = currentComponent.name;
      const allProps = componentsList.find(item => item.name === currentComponentName).propsType;

      const currentProp = currentComponent.props;

      const handleChange = (value, name) => {
        // const value = e.target.value;
        const copiedList = cloneDeep(list);
        const target = copiedList.find(item => item.id == currentConfigId);
        target.props[name] = value;
        setList(copiedList)
      }

      const renderConfigForm = (type, value, onChange, values, defaultValue) => {
        switch (type) {
          case "input":
            return <Input style={{ width: 120 }} value={value} onChange={e => onChange(e.target.value)} />;
          case "select":
            return (<Select style={{ width: 120 }} value={value} onSelect={value => onChange(value)} options={values}>

            </Select>);

          case "color":
            return (<ColorPicker value={value} onChange={(color, hex) => onChange(hex)} />);
          case "boolen":
            return <Switch
              defaultChecked={defaultValue}
              checked={value}
              onChange={value => onChange(value)} />
          default:
            return <Input style={{ width: 120 }} value={value} onChange={e => onChange(e.target.value)} />;
        }
      }

      return (<div>
        <div className={styles.config_current_comp}>当前组件：{currentComponentName}</div>
        {allProps.map((item, index) => {
          return (<div key={item.name + index} className={styles.config_prop_item} >
            <div>{item.label}</div>
            {renderConfigForm(item.type, currentComponent[item.name], (value) => handleChange(value, item.name), item.values, item.default)}
            {/* <input value={currentProp[item.name]} onChange={value => handleChange(value, item.name)} /> */}
          </div>)
        })}
      </div>)
    } else {
      return <div>请选择你要配置的组件</div>
    }
  }


const renderStyle=()=>{
  return <div>
     <span>背景颜色：</span>
     <span>
      <input value="#ff"/>
     </span>
  </div>
}

  return (
    <div className={styles.config_container}>
      <div className={styles.config_title}>配置区</div>
      <div>{renderConfig()}</div>
      <div className={styles.config_title}>样式区</div>
      <div>{renderStyle()}</div>
    </div>
  )
}

export default Config