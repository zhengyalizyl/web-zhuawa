import React from 'react';
import styles from './app.module.less';
import { HashRouter, useRoutes } from 'react-router-dom';
import { router } from './router';

const Routers=()=>useRoutes(router);

export default function App() {
  return (
    <HashRouter>
       <Routers/>
    </HashRouter>
  )
}
