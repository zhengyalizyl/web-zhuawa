import React from 'react';
import Menu from '@/components/menu';
import styles from './index.less'

const AsideLayouts = (props: any) => {
  return (
    <div className={styles.layout2_wrap}>
      <div className={styles.layout2_nav}>
          <Menu></Menu>
          </div>
          <div>{props.children}</div>
    </div>
  )
}

export default AsideLayouts;