import React from 'react';
import styles from './index.module.css';
import {Button} from 'antd'
import {HighlightOutlined} from '@ant-design/icons'

const  Header=()=>{
  return (
    <div className={styles.header}>
            <div className={styles.header_left}>
              <div className={styles.header_avatar}>
                <HighlightOutlined/>
                </div> 
                <div className={styles.header_logo}>zyl低代码平台</div>
            </div>
            <div className={styles.header_right}>
              <Button type="primary">部署</Button>
              <Button>登陆</Button>
            </div>
    </div>
  )
}

export default Header