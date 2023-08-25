const  http=require('http');
const Websocket =require('ws');


const server=http.createServer();

const wss= new Websocket.Server({server});

wss.on('connection',(socket)=>{
  console.log('websocket连接已打开');
   
  socket.on('message',(message)=>{
    console.log('收到消息:'+message);
    socket.send('hello')
  })

  socket.on('close',()=>{
    console.log('websocket连接失败')
  })
})


server.on('request',(request,response)=>{
  response.writeHead(200,{'Content-Type':'text/plain'});
  response.end('hello word for tess');
})

server.listen(8080,()=>{
  console.log('服务器已启动，端口号为8080')
})