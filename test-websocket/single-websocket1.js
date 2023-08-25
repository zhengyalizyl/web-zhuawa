class WebSocketClass {
  constructor(config) {
    this.instance = null;
    this.ws = null;
    this.status=null;
    this.config=null;
    this.init();
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
    this.connect();
  }

  //创建连接
  connect(){
    const { url } = this.config;
    console.log(ws)
    this.ws = new WebSocket(url);
     this.ws.open=e=>{
        this.status='open';
        console.log('连接成功');
        this.getMessage()
     }
  }


  //重连
  reconnect(){
     if(this.status!=='close'){
      //不是手动关闭，需要重连
      console.log('重新连接');
      this.connect();
     }else{
        console.log('手动关闭')
     }
  }

  //获取信息
  getMessage(){
     this.ws.onmessage=(e)=>{
         console.log('获得消息',e.data)
         this.status='message'
         return e.data;
     }
  }

  //手动关闭连接
  closeConnect(){
    this.status='close';
    this.ws.send('close');
    //关闭连接
    this.ws.close();
  }

  onError(){
    this.ws.onerror=e=>{
       console.log('失败了');
       this.status='error'
    }
  }
}