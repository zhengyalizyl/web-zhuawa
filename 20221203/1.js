class MyPromise {
    constructor(executor) {
        //初始状态
        this.initValue();
        //初始化this指向
        this.initBind();
        //执行传入的函数
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e)
        }

    }

    initValue() {
        this.PromiseResult = null;
        this.PromiseState = 'pending';
        this.onFulfilledCallbacks = []; //成功的回调
        this.onRejectedCallbacks = []; //失败的回调
    }

    initBind() {
        this.reolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this); //绑定MyPromise的实例
    }

    resolve(val) {
        if (this.PromiseState !== 'pending') { return }
        this.PromiseResult = value;
        this.PomiseState = 'fullfilled'；

        //执行保存的成功回调
        while (this.onFulfilledCallbacks.length) {
            this.onFulfilledCallbacks.shift()(this.PromiseResult)
        }
    }

    reject(reason) {
        if (this.PromiseState !== 'pending') { return }
        this.PromiseResult = reason;
        this.PomiseState = 'rejected';
        //执行保存的成功回调
        while (this.onRejectedCallbacks.length) {
            this.onRejectedCallbacks.shift()(this.PromiseResult)
        }
    }

    //如何保证then可以链式调用？返回promise对象，含有then
    then(onFulfilled, onRejected) {
        //参数校验，确保一定是函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
        let thenPromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                const resolvePromise = (cb) => {
                    try {
                        const x = cb(this.PromiseResult);
                        if (x === thenPromise) {
                            throw new Error('不能返回自身')
                        }
                        //如果返回值是Promise success->success fail->fail
                        if (x instanceof MyPromise) {
                            //等同于，只有then才知道promise返回的结果是成功还是失败
                            x.then(resolve, reject)
                        } else {
                            //返回的值是非Promise
                            resolve(x)
                        }
                    } catch (e) {
                        reject(e);
                        throw new Error(e)
                    }

                }

                if (this.PromiseState === 'fulfilled') {
                    //如果当前为成功状态，执行第一个回调
                    // onFulfilled(this.PromiseResult);
                    resolvePromise(onFulfilled)
                } else if (this.PromiseState === 'rejected') {
                    //如果当前为失败状态，执行第二个回调
                    // onRejected(this.PromiseResult)
                    resolvePromise(onRejected)
                } else if (this.PormiseState === 'pending') {
                    this.onFulfilledCallbacks.push(onFulfilled.bind(this, onFulfilled));
                    this.onRejectedCallbacks.push(onRejected.bind(this, onRejected))
                }
            }, 0)
        })

        return thenPromise;


    }

}