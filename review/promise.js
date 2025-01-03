/**
 * promise特点
 * 执行了resolve状态变成了fulfilled
 * 执行reject，状态变成了rejected
 * 状态不可逆
 * throw报错相当于执行reject
 * 三个状态
 *  pending 等待中
 *  fulfilled 成功
 *  rejected 失败
 * 链式调用
 */

class MyPromise {
  constructor(executor) {
    this.initValue();
    this.initBind();
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error)
    }
  }

  initValue() {
    this.PromiseResult = null;
    this.PromiseState = 'pending';
    this.onFulfilledCallbacks = [];//保存成功的回调
    this.onRejectedCallbacks = [];//保存失败的回调
  }

  initBind() {
    this.reject = this.reject.bind(this);
    this.resolve = this.resolve.bind(this);
  }

  resolve(value) {
    if (this.PromiseState !== 'pending') {
      return
    }
    this.PromiseState = 'fullfilled';
    this.PromiseResult = value;

    //执行队列中回调
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult)
    }
  }

  reject(reason) {
    if (this.PromiseState !== 'pending') {
      return
    }
    this.PromiseState = 'rejected';
    this.PromiseResult = reason;
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected == 'function' ? onRejected : reason => {
      throw reason
    }




    let thenPromise = new MyPromise((resolve, reject) => {
      //then需要返回一个新的promise对象，链式调用then
      const resolvePromise = (cb) => {
        try {
          // onFulfilled(this.PromiseResult)
          const x = cb(this.PromiseResult);
          if(x==thenPromise &&x){
            throw new Error('不能调用自身')
          }
          if (x instanceof MyPromise) {
            x.then(resolve, reject);
          } else {
            resolve(x);
          }
        } catch (error) {
          reject(error);
          throw new Error(error)
        }
      }

      if (this.PromiseState == 'fulfilled') {
        // onFulfilled(this.PromiseResult)
        resolvePromise(onFulfilled)
      } else if (this.PromiseState == 'rejectd') {
        // onRejected(this.PromiseResult)
        resolvePromise(onRejected)
      } else if (this.PromiseState == 'pending') {
        // this.onFulfilledCallbacks.push(onFulfilled.bind(this));
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled));
        // this.onRejectedCallbacks.push(onRejected.bind(this));
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected));
      }

    });

    return thenPromise;
  }

}

let p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('122')
  }, 1000);
}).then((res) =>new MyPromise(resolve=>{
  console.log(res);
  resolve(res*3)
}), (err) => console.log('err', err)).then(res => console.log(res));

console.log(p1);