import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";
import singleSpaCss from "single-spa-css";

const cssLifecycle =singleSpaCss({ //作为一个基础存在
  cssUrls:[
    'http://localhost:8080/style.css', //引入./style.css 放在主应用上面
  ],
  webpackExtractedCss:false,
  shouldUnmounted:true,
})

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

// export const { bootstrap, mount, unmount } = lifecycles;


export const bootstrap =[
  cssLifecycle.bootstrap,
  lifecycles.bootstrap
];

export const mount =[
  cssLifecycle.mount,
  lifecycles.mount
];

export const unmount =[
 lifecycles.unmount,
 cssLifecycle.unmount
]