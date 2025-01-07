import {useNavigate} from 'react-router-dom';
import {Button} from 'antd';
import Svg404 from '@/icons/svg/404.svg'

const Error404 = () => {
  const navigate = useNavigate();
 return (
  <div className="flex h-full">
      <div className="px-4 m-auto text-center space-y-4 max-[400px]">
        <h1 className="text-4xl text-slate-800 dark:text-neutral-200">
          Sorry,page not found!
        </h1>
        <p className="text-base text-slate-500 dark:text-neutral-400">
          Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling.
        </p>
        <div className='flex justify-center items-center text-center'>
            <div className='w-[300px]'>
               <img src={Svg404} alt="404" />
              </div>       
        </div>
        <Button onClick={() => navigate('/')}>go to Home</Button>
      </div>
  </div>
 )
}

export default Error404