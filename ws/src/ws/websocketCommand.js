
// https://blog.csdn.net/weixin_43588412/article/details/139474036?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-3-139474036-blog-131807801.235%5Ev43%5Econtrol&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-3-139474036-blog-131807801.235%5Ev43%5Econtrol&utm_relevant_index=6
/**
 * 发起websocket请求函数
 * @param {object} wsObj  - ws对象
*  @param {string} type  - 操作websocket：销毁close、创建create
*  @param {number} timeout  - 心跳间隔时长，默认5000ms
 * @param sendHeartBeat  - 以心跳，内容体区分string、object
 * @param {function} msgCallback  - 接收到ws数据，对数据进行处理的回调函数
 * @param {function} reCallback  - ws每次重连时，暴露对外的回调函数
 */
export function websocketCommand(wsObj,type,timeout=5000, sendHeartBeat, msgCallback, reCallback) {  
  let wsDestroy = type ==='close';  //  销毁标志
  let lockReconnect = false;  // 是否真正建立连接
  let timeoutObj = null;  // 心跳倒计时
  let serverTimeoutObj = null;  // 服务器心跳倒计时
  let timeoutnum = null;  // 断开 重连倒计时

  // 若type传入close，则意图销毁websocket
  if(type==='close'){
    clearTimeout(timeoutObj);
    clearTimeout(serverTimeoutObj);
    onClose();
  }
  // 若type传入create，则意图新建websocket，需初始化ws并发送心跳
  if(type==='create'){
    initWebsocket();
    websocketSend();  
  }

  function initWebsocket(){   
    if (typeof (WebSocket) === 'undefined') {
        console.log();('您的浏览器不支持WebSocket，无法获取数据');
        return false;
    }
    wsObj.onmessage = function (e) { onMessage(e) };
    wsObj.onopen = function () { onOpen() };
    wsObj.onerror = function () { onError() };
    wsObj.onclose = function () { onClose() } ;
  }

  function websocketSend () {
    // 加延迟是为了尽量让ws连接状态变为OPEN   
    setTimeout(() => { 
      // 添加状态判断，当为OPEN时，发送消息
      if (wsObj.readyState === wsObj.OPEN) { // wsObj.OPEN = 1 
        // console.log('类型',typeof sendHeartBeat);
        if( typeof sendHeartBeat == 'string'){
          // 若发送基本类型数据作为心跳，如字符串，直接将参数发送给服务端
          wsObj.send(sendHeartBeat)
        }else{
          // 若发送复杂类型数据作为心跳，如对象，则以回调方式暴露出去（得以支持动态数据）
          sendHeartBeat();
        }
      }
      // if (wsObj.readyState === wsObj.CLOSED) { // wsObj.CLOSED = 3 
      //   console.log('readyState=3')
      // }
    }, 500)
  }

  function onMessage(evt) {
    var received_msg = evt && JSON.parse(evt.data);
    msgCallback(received_msg);

    // 收到服务器信息, 重置服务器心跳
    start();
  }

  function onError() {
    console.log('ws_error');
    // 断网重连机制
    if(!wsDestroy){
      reconnect();
    }
  }

  function onOpen() {
    console.log("ws_open");
    // 连接成功向服务器发送信息，并开启心跳
    websocketSend();
    start();
  }

  function reconnect() {
    // 避免重复建立连接
    if (lockReconnect) { 
      return;
    }
    lockReconnect = true;
    // 没连接上会一直重连，设置延迟避免请求过多
    timeoutnum && clearTimeout(timeoutnum);
    timeoutnum = setTimeout(function() {
      // 重连
      initWebsocket();
      // 若重连后有需额外处理的逻辑，通过reCallback()回调暴露出去
      // reCallback?.();
      lockReconnect = false;
    }, timeout);
  }

  function start() {
   // 清计时器
    timeoutObj && clearTimeout(timeoutObj);
    serverTimeoutObj && clearTimeout(serverTimeoutObj);
    // 开启心跳
    timeoutObj = setTimeout(function() {
      if (wsObj.readyState == 1) {
        // 如果连接正常，发送心跳（服务端收到后会返回一条消息）
        websocketSend();
      } else {
        // 否则重连
        reconnect();
      }
      // 超时关闭
      serverTimeoutObj = setTimeout(function() {  
        wsObj.close();
      }, timeout);
    }, timeout);
  }

  function onClose() {
    if(!wsDestroy ){
      // 重连机制
      reconnect();
    }else if (wsObj.readyState == 1) {
      console.log('ws_close',wsObj);
     // 如果ws连接正常，则清计时器、断开连接
      clearTimeout(timeoutObj);
      clearTimeout(serverTimeoutObj);
      wsObj?.close?.();
    }
  } 
  
}
