import { createApp } from 'vue'
import './style.css'
import App from './App.vue';
import  {renderWithQiankun,qiankunWindow} from 'vite-plugin-qiankun/dist/helper'
import router from './router';

let app:any;
if(!qiankunWindow.__POWERED_BY_QIANKUN__){

  createApp(App).mount('#app')
} else{
  renderWithQiankun({
     //子应用挂载
     mount(props){
       app=createApp(App);
       app.use(router)
       app.mount(props.container?.querySelector('#app'));
     },
     //只有子应用第一次加载会触发
     bootstrap() {
       console.log('vue app bootstrap');
     },

     //更新
     update(){
      console.log('vue app update');
     },

     //卸载
     unmount(){
       console.log('vue app unmount');
       app?.unmount();
     }
  })
}
