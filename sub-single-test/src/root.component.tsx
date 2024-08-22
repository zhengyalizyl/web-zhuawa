// 子应用的 root.component.tsx
import React from "react";
import { BrowserRouter, Route, Link, useRoutes } from "react-router-dom";
// 在src目录创建两个组件
import Home from "./Home";
import About from "./About";

// 创建路由
const routes = [
  {
    path: "/",
    element: (<Home></Home>)
  },
  {
    path: "/home",
    element: (<Home></Home>)
  },
  {
    path: "/about",
    element: (<About ></About >)
  },
];
function RouterView() {
  const elem = useRoutes(routes)
  return elem
}
export default function Root(props) {
  // return <section>{props.name} is mounted!</section>;

  return (
    <BrowserRouter basename="/sub-single-test">
      <div>{props.name}</div>
      <div>
        <Link to="/home">Home |</Link>
        <Link to="/about"> About</Link>
      </div>
      <RouterView />
    </BrowserRouter>
  );
}
