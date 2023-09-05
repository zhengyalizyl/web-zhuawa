const lru = new LRUCache(capacity);
lru.put(1,1);
lru.put(2,2); // {1:1,2:2}
lru.get(1);//{2:2,1:1}
lru.put(3,3) //{1:1，3:3}
lru.get(2) // -1
lru.put(4,4) // {3:3,4:4}
lru.get(1)

//  函数的get 和 put必须以o(1)的时间复杂度运行
// get，是hash,Map,set
// es6迭代器iterator

const  LRUCache=function(capacity){
  this.cacheQueue= new Map();
  this.capacity = capacity;
}

LRUCache.prototype.get=function(key){
    if(this.cacheQueue.has(key)){
      //如果找到了，我们是不是这个key对应的value,要提升新鲜度
      const result = this.cacheQueue.get(key);
      this.cacheQueue.delete(key);
      this.cacheQueue.set(key,result);
      return result;
    }
    
    return  -1
}

LRUCache.prototype.put=function(key,value){
  if(this.cacheQueue.has(key)){
    this.cacheQueue.delete(key)
  }
  if(this.cacheQueue.size>=this.capacity){
    //删除map的第一个元素，即最长未使用的
    this.cacheQueue.set(key,value);
    this.cacheQueue.delete(this.cacheQueue.keys().next().value)
  }else{
    this.cacheQueue.set(key,value);
  }
}