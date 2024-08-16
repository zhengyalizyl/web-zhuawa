/**
 * 本地存储工具 SDK
 * 1. 可以在初始化的时候，就决定，你是要在本地存储，还是在其他地方存储，并且我能确定你是 
 *  (localStorage, sessionStorage)
 *  - 所有的 API 都一样，只有初始化参数不一样。
 * 
 * 2. 如果浏览器的存储，出现了异步的时序问题，高频的线程问题，我都可以解决；
 * 3. 如果本地缓存有问题，我在处理数据的时候，我是可以降级的
 * 4. 不用自己去解析，这个存储支持数组方法等。
 * 
 * 加密、解密、过期时间。
 * 
 * ---> 我们做一些过度设计。来看看，一个小工具，怎么尽量做到极致，来丰富自己的简历。
 */

// 是一个类，存储类
const CreateStore = function(unlocal = false, opts = {}) {
  this.unlocal = unlocal;
  this.maxLength = opts.maxLength || 30;
  this.expireTime = opts.expireTime || NaN;
  this.plugins = opts.plugins || [];
  this.observe();
}

// 基本方案，CreateStore 的实例，就是 __mock__storage 的数据
CreateStore.prototype.set = function(type, data) {
  this.__mock__storage[`${this.bizcode}_${type}`] = data;
}

CreateStore.prototype.get = function(type) {
  return this.__mock__storage[`${this.bizcode}_${type}`]
}


CreateStore.prototype.observe = function() {
  const context = this;
  this.__mock__storage = new Proxy({}, {
      get(target, propKey, receiver) {
          let result;
          if(!context.unlocal) {
              // 如果你选用的是，本地的存储方式，我直接给你 getItem
              result = (context.getItem?.(propKey) || Reflect.get(target, propKey, receiver))
          } else {
              result = Reflect.get(target, propKey, receiver)
          }
          return result;
      },
      set(target, propKey, value, receiver) {
          let _value = value;
          // 数据要劫持一下
          // 这里就是你核心业务层的代码
          if(value instanceof Array && value.length > context.maxLength) {
              _value = value.slice(0, maxLength);
          }
          if(context.expireTime) {
              // ... plugins
          }
          // 
          if(!context.unLocal) {
              context.setItem?.(propKey, _value);
          }

          return Reflect.set(target, propKey, value, receiver);
      }
  })
}

CreateStore.prototype.getItem = function(type) {
  if(!window) throw new ErrorEvent('browser runtime need...');
  const data = window[this.storageMethod].getItem(type);
  let dataJSON;
  try {
      dataJSON = JSON.parse(data)
  } catch(err) {
      throw new Error(err);
  }

  return dataJSON;
}

CreateStore.prototype.setItem = function(type, data) {
  if(!window) throw new ErrorEvent('browser runtime need...');
  const dataJSON = JSON.stringify(data);
  window[this.storageMethod].setItem(type, dataJSON);
};

const methodArr = ['pop', 'push', 'unshift', 'shift', 'reverse', 'splice'];

methodArr.forEach((method) => {
  CreateStore.prototype[method] = function(type, ...rest) {
      if(!this.get(type)) {
          this.set(type, []);
      }
  
      if(!this.get(type) instanceof Array) {
          throw new Error("must be arr")
      }
  
      const dataList = this.get(type);
      // dataList.push(...rest);
      Array.prototype[method].apply(dataList, rest);
      this.set(type, dataList);
  
  }
})



const CreateLocalStore = function(bizcode, ...rest) {
  CreateStore.apply(this, rest);
  this.bizcode = bizcode;
  this.storageMethod = "localStorage";
}

CreateLocalStore.prototype = Object.create(CreateStore.prototype);
CreateLocalStore.prototype.constructor = CreateLocalStore;

const CreateSessionStore = function(bizcode, ...rest) {
  CreateStore.apply(this, rest);
  this.bizcode = bizcode;
  this.storageMethod = "sessionStorage";
}

CreateSessionStore.prototype = Object.create(CreateStore.prototype);
CreateSessionStore.prototype.constructor = CreateSessionStore;

export const localStore = new CreateLocalStore('zyl');
