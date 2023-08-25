class WebSocketClass {
  constructor(config) {
    this.instance = null;
    this.ws = null;
    this.status = null;
    this.config = null;
    this.maxReconnectionAttempts = 0;//最大重连次数
    this.reconnectInterval = 1000; //重连间隔
    this.reconnectAttempts = 0;//重连次数
    this.maxReconnectionInterval = 30000;//最大断连时间
    this.lockReconnect = false // 是否真正的建立连接
    this.init(config);
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new WebSocketClass();
    }
    return this.instance;
  }

  //初始化
  init(config) {
    this.config = config;
    const { maxReconnectionAttempts, reconnectInterval = 1000 } = config;
    this.maxReconnectionAttempts = maxReconnectionAttempts;
    this.reconnectInterval = reconnectInterval;
    this.connect();
  }

  //创建连接
  connect() {
    const { url } = this.config;
    this.ws = new WebSocket(url);
    //这里需要判断重连的次数了
    if (this.reconnectAttempts) {
      //如果重连的次数比最大尝试次数要大，则不应该进行连接
      if (this.maxReconnectionAttempts && this.maxReconnectionAttempts < this.reconnectAttempts) {
        return
      } else {
        //重新连接或者初次连接都需要将次数清零
        this.status = 'connecting';
        this.reconnectAttempts = 0;
      }
    }

    //如果不用bind,会导致this的指向发生问题
    this.ws.onopen = this.openConnect.bind(this);
    this.ws.onmessage = this.getMessage.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.autoClose.bind(this);

  }

  //发送消息
  sendMsg(data) {
    //这里需要检测一下
    if (this.status === 'open') {
      this.ws.send(data)
    }
  }


  openConnect() {
    this.status = 'open';
    console.log('连接成功');
  }



  //重连
  reconnect() {
    if (this.status !== 'close') {
      //不是手动关闭，需要重连
      console.log('重新连接');
      //这里如果正在连接的话，需要等待连接
      if (this.lockReconnect) {
        return;
      }
      this.lockReconnect = true;
      //设置延迟重连，避免重连次数过多
      setTimeout(() => {
        this.lockReconnect = false;
        this.connect();
      }, 2000)
    } else {
      console.log('手动关闭')
    }
  }


  //手动连接
  forceReconnect() {
    console.log('手动连接');
    //先关闭连接，再重新连接
    if (this.ws && this.status === 'open') {
      this.closeConnect();
    }
    this.connect();
  }

  //获取信息
  getMessage(e) {
    console.log('获得消息', e.data)
    // this.status = 'message';这里不需要加入状态，会导致强制关闭的会出现问题
    //这里需要自己处理信息
    return e.data;
  }

  //手动关闭连接
  closeConnect() {
    this.status = 'forceClose';
    this.ws.send('close');
    //关闭连接
    this.ws.close();
  }

  //自动关闭
  autoClose() {
    if (this.status === 'forceClose') {
      this.status = 'close';
    } else {
      //说明是断开连接了，但是没有手动关闭
      //此时需要将场次连接需要加1，同时将计算一下最大断连时间
      this.reconnectAttempts += 1;
      const time = this.reconnectInterval * this.reconnectAttempts;
      const min = Math.min(this.maxReconnectionInterval, time);
      setTimeout(() => {
        this.connect();
      }, min)
    }

  }

  onError() {
    console.log('失败了');
    this.status = 'error';
    //同时启动重连
    this.reconnect();
  }
}


//缺点，关闭连接后，点击发送消息，是无法知道是否已经连接的
  // 自动重新连接后，无法自动发送消息，需要手动发送消息
