import React from "react";
import { Outlet, RouteObject } from "react-router-dom";
import Home from "../pages/home";
import RecommandList from "../pages/home/tabs/recommandList";

export interface extraBizObject {
    title?: string;
}

export type ZHRouter = Array<RouteObject & extraBizObject>;

export const router: ZHRouter = [
    {
        path: "/", element: <Home />, title:"首页",
        children: [
            { path: '', element: <RecommandList /> },
            { path: 'follow', element: <div>关注</div> },
            { path: 'hot', element: <div>热榜</div> },
            { path: 'zvideo', element: <div>视频</div> },
        ]
    },
    {
        path: "/education", element: <div>知学堂<Outlet /></div>, title:'知乎知学堂',
        children: [
            { path: 'learning', element: <div>教育</div> }
        ]
    },
    {
        path: "/explore", element: <div>发现</div>, title: "发现",
    },
    {
        path: "/question", element: <div>等你来答</div>, title:'等你来答',
        children: [
            { path: 'waiting', element: <div>为你推荐</div>}
        ]
    },
]