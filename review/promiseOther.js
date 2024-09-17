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
          if (x == thenPromise && x) {
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

  // 1. 接收一个Promise数组，数组中如有非Promise项，则此项当做成功；
  // 2. 如果所有Promise都成功，则返回成功结果数组；
  // 3. 如果有一个Promise失败，则返回这个失败结果；
  static all(promises) {
    const result = [];
    let count = 0;
    return new MyPromise((resolve, reject) => {
      const addData = (index, data) => {
        result[index] = data;
        count++;
        if (count === promises.length) {
          resolve(result)
        }
      }

      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(res => {
            addData(index, res)
          }, err => reject(err))
        } else {
          addData(index, promise)
        }
      });
    })
  }

  //接收promise数组，那个promise最快得到结果,无论成功失败
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise) => {
        if (promise instanceof MyPromise) {
          promise.then(res => { resolve(res), err => { reject(err) } })
        } else {
          resolve(promise)
        }
      })
    })
  }

  //把promise每个结果，存储返回数组
  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      const res = [];
      let count = 0;
      const addData = (status, value, i) => {
        res[i] = {
          status,
          value
        }
        count++;

        if (count === promises.length) {
          resolve(res)
        }
      }

      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(res => {
            addData('fulfilled', res, index);
          }, err => addData('rejected', err, index))
        } else {
          addData('fulfilled', promise, index)
        }
      })

    })


  }

  //any有一个成功，返回成功结果，所有都失败，则报错
  static any(promises) {
    return new MyPromise((resolve, reject) => {
      let count = 0;
      promises.forEach((promise) => {
        promise.then(val => resolve(val), err => {
          count++;
          if (count === promises.length) {
            reject(new AggregateError('all promises were rejected'))
          }
        })
      })
    })
  }

       // 1. 接收一个Promise数组，数组中如有非Promise项，则此项当做成功；
      // 2. 哪个Promise最快得到结果，就返回那个结果，无论成功失败；
      race(promises) {
        return new MyPromise((resolve, reject) => {
          promises.forEach((promise, index) => {
            if (promise instanceof MyPromise) {
              promise.then(res => resolve(res), err => reject(err))
            } else {
              resolve(promise)
            }
          })
        })
      }

}

let p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('122')
  }, 1000);
}).then((res) => new MyPromise(resolve => {
  console.log(res);
  resolve(res * 3)
}), (err) => console.log('err', err)).then(res => console.log(res));

console.log(p1);