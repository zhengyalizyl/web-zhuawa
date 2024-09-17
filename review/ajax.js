function ajax(options) {
  const hrl = new XMLHttpRequest();
  //初始化参数的内容
  options = options || {};
  options.type = (options.type || 'GET').toUpperCase();
  options.dataType = options.dataType || 'json';
  const params = options.data;

  //发送请求
  if (options.type === 'GET') {
    xhr.open('GET', options.url + "?" + params, true);
    xhr.send(null);
  } else if (options.type === 'POST') {
    xhr.open('POST', options.url, true);
    xhr.send(params)
  }


  //接收请求
  xhr.onreadystatechange=function(){
    if(xhr.readyState===4){
      let status=xhr.status;
      if(status>=200 && status<200){
        options.success&&options.success(xhr.responseText,xhr.responseXML)
      }else{
         options.fail && options.fail(status);
      }
    }
  }

}



//使用方式如下
ajax({
   type:'post',
   dataType:'json',
   data:{},
   url:'https://xxx',
  success:function(text,xml){ //请求成功后的回调函数
    console.log(text);
  },
  fail:function(status){ //请求失败后的回调函数
     console.log(status);
  }
})