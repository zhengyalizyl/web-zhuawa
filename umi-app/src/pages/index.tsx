import yayJpg from '../assets/yay.jpg';
import axios from 'axios';
import { useEffect } from 'react';


export default function HomePage() {
  useEffect(()=>{
    axios.get('/list').then(res=>console.log(res))
  },[])
  return (
    <div>
      <h2>Yay! Welcome to umi!</h2>
      <p>
        <img src={yayJpg} width="388" />
      </p>
      <p>
        To get started, edit <code>pages/index.tsx</code> and save to reload.
      </p>
    </div>
  );
}
