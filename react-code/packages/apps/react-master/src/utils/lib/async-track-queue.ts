import { debounce } from 'lodash-es';
interface RequiredData {
    timestamp: number | string;
}

// 如果我还没有上报，queueData 还有数据的时候，用户把浏览器关了怎么办？
/**
 * 如果我还有 queueData 没上报
 * 我就用 localStorage 去存一下
 * 等下一次你打开浏览器的时候，再追加
 */

class TaskQueueStorableHelper<T extends RequiredData = any> {
    // 先来一个单例
    private static instance: TaskQueueStorableHelper | null = null;
    // 单例
    public static getInstance<T extends RequiredData = any>() {
        if(!this.instance) {
            this.instance = new TaskQueueStorableHelper<T>();
        }

        return this.instance;
    }

    private STORAGE_KEY = "luyi_local"
    protected store: any = null;


    // contructor 是我再次打开浏览器的时候，要执行的函数。
    // 如果这个时候，我指定的 key 的内容还有，说明我上次没上报完
    constructor() {
        const localStorageVal = localStorage.getItem(this.STORAGE_KEY);
        if(localStorageVal) {
            // 说明还没上报完，那我把它放到一个地方，等下次，一起报
            try {
                this.store = JSON.parse(localStorageVal)
            } catch(err: any) {
                throw new Error(err);
            }
        }
    }


    get queueData() {
        return this.store?.queueData || [];
    }

    set queueData(value: Array<T>) {

        // const _queueData = [...this.store?.queueData, ...value].sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
        // this.store ={ queueData:  _queueData;

        this.store = {
            ...this.store,
            queueData: value.sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.store));
        
        // this.store = {
        //     ...this.store,
        //     queueData: value.sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
        // }

    }
}



// 第二层，我们要做一个收集的工作，收集多少，怎么发？
export abstract class AsyncTrackQueue<T extends RequiredData> {

    // 本地存储服务
    private get storableService() {
        return TaskQueueStorableHelper.getInstance();
    }

    // private queueData:Array<T> = []; 
    private get queueData(): Array<T> {
        return this.storableService.queueData;
    }

    private set queueData(value: Array<T>) {
        this.storableService.queueData = value;
        if(value.length) {
            this.deounceRun()
        }
    }

    public addTask(data: T | Array<T>) {
        this.queueData = this.queueData.concat(data);
    };

    protected abstract comsumeTaskQueue(data: Array<T>): Promise<any>;

    // 我何时上报？
    // 我在一段时间内，没有 addTask 了，也就是不再添加数据的时候，我再去上报
    protected deounceRun = debounce(this.run.bind(this), 500);

    private run() {
        const currentList = this.queueData;
        if(currentList.length) {
            this.queueData = [];
            this.comsumeTaskQueue(currentList);
        }
    }

}