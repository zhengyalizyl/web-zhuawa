import React from 'react';
import styles from './app.module.less';


export default function App() {
  console.log(styles,'------')
  return (
    <div className={styles.app}>
      <div className='flex flex-1'>
         <div>hhh</div>
         <div>233</div>
      </div>
    </div>
  )
}
