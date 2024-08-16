import { AsyncTrackQueue } from "./async-track-queue";

interface TrackData {
    id: string;
    seqId: number;
    timestamp: number;
}

export interface UserTrackData {
    msg?: string;
}

// 我们假设，这个是我们的 埋点的 API，我每一次调用，是不是真的要马上发起请求；
// 有些sendLog，我们收集一波，完了一起发送。
export class BaseTrack extends AsyncTrackQueue<TrackData> {
    private seq = 0;
    // 收集
    public track(data: UserTrackData) {
        this.addTask({
            id: `${Math.random()}`,
            seqId: this.seq++,
            timestamp: Date.now(),
            ...data,
        })
    }


    // 上报
    // 这里就是一个异步批量的逻辑
    public comsumeTaskQueue(data: Array<TrackData & UserTrackData>) {
        /**
         * return new Promise((resolve) => {
         *  const image = new Image();
         *  image.src = 'https://luyi.com/xxx/logs?data=${JSON.stringify(data)}';
         *  image.onload = () => {
         *      resolve(true)}
         *  }
         * })
         */
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data.map((item) => item.msg));
            })
        }).then(console.log)
    }
}